"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Resuelve el branch_id para insertar en Supabase.
 * Si ya tenemos uno del contexto de sesión, lo usa.
 * Si no, busca la primera sucursal activa del restaurante.
 */
async function resolveBranchId(
  restaurantId: string,
  branchId: string | null
): Promise<string | null> {
  if (branchId && isUUID(branchId)) return branchId;
  try {
    const sb = createServerSupabaseClient();
    const { data } = await sb
      .from("branches")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("status", "active")
      .limit(1)
      .single();
    return data?.id ?? null;
  } catch {
    return null;
  }
}

// ─── Crear pedido ─────────────────────────────────────────────────────────────

/**
 * Sincroniza un pedido nuevo hacia Supabase.
 * Devuelve el UUID de Supabase (para guardarlo en el order local como supabase_id).
 * Si falla, devuelve null — localStorage sigue como fuente de verdad.
 */
export async function syncOrderCreate(
  order: Order,
  restaurantId: string,
  branchId: string | null
): Promise<string | null> {
  if (!restaurantId) return null;

  try {
    const sb             = createServerSupabaseClient();
    const resolvedBranch = await resolveBranchId(restaurantId, branchId);

    if (!resolvedBranch) {
      console.warn("[syncOrderCreate] no valid branch_id for restaurant:", restaurantId);
      return null;
    }

    const total = order.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    const { data: placed, error: orderError } = await sb
      .from("placed_orders")
      .insert({
        restaurant_id:        restaurantId,
        branch_id:            resolvedBranch,
        waiter_name_snapshot: order.waiter_name,
        status:               order.status,
        total_amount:         total,
        notes:                order.notes ?? null,
        metadata: {
          local_id:    order.id,        // ORD-... del demo-store
          table_label: order.table,
          source:      "demo_store",
        },
      })
      .select("id")
      .single();

    if (orderError || !placed) {
      console.warn("[syncOrderCreate] placed_orders insert failed:", orderError?.message);
      return null;
    }

    // Insertar order_items
    if (order.items.length > 0) {
      const items = order.items.map((item) => ({
        placed_order_id:     placed.id,
        menu_item_id:        isUUID(item.menu_item_id) ? item.menu_item_id : null,
        name_snapshot:       item.name,
        unit_price_snapshot: item.unit_price,
        quantity:            item.quantity,
        station:             item.station,
      }));

      const { error: itemsError } = await sb.from("order_items").insert(items);
      if (itemsError) {
        console.warn("[syncOrderCreate] order_items insert failed:", itemsError.message);
        // El placed_order quedó registrado aunque los items fallen — aceptable en demo
      }
    }

    return placed.id; // UUID de Supabase para tracking
  } catch (err) {
    console.warn("[syncOrderCreate] unexpected error:", err);
    return null;
  }
}

// ─── Avanzar estado ───────────────────────────────────────────────────────────

/**
 * Sincroniza el avance de estado en Supabase y registra el kitchen_event.
 * Busca por metadata->>'local_id' (no necesita UUID guardado en localStorage).
 * Devuelve el UUID del placed_order en Supabase (para logs/debug).
 */
export async function syncOrderStatusUpdate(
  localOrderId: string,
  fromStatus: Order["status"],
  newStatus: Order["status"],
  restaurantId: string,
  branchId: string | null
): Promise<string | null> {
  if (!restaurantId) return null;

  try {
    const sb             = createServerSupabaseClient();
    const resolvedBranch = await resolveBranchId(restaurantId, branchId);

    // 1. Actualizar status y obtener el UUID de Supabase
    const { data: updated, error: updateError } = await sb
      .from("placed_orders")
      .update({ status: newStatus })
      .eq("restaurant_id", restaurantId)
      .contains("metadata", { local_id: localOrderId })
      .select("id")
      .single();

    if (updateError || !updated) {
      console.warn("[syncOrderStatusUpdate] update failed:", updateError?.message);
      return null;
    }

    // 2. Registrar kitchen_event (historial de cocina)
    if (resolvedBranch) {
      const { error: eventError } = await sb.from("kitchen_events").insert({
        restaurant_id:  restaurantId,
        branch_id:      resolvedBranch,
        placed_order_id: updated.id,
        station:        "hot",   // default; en producción vendría del item de la orden
        from_status:    fromStatus,
        to_status:      newStatus,
        metadata:       { local_order_id: localOrderId },
      });

      if (eventError) {
        console.warn("[syncOrderStatusUpdate] kitchen_event insert failed:", eventError.message);
      }
    }

    return updated.id;
  } catch (err) {
    console.warn("[syncOrderStatusUpdate] unexpected error:", err);
    return null;
  }
}

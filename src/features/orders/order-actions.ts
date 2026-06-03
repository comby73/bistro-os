"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order } from "./types";

/**
 * Sincroniza un pedido nuevo desde localStorage hacia Supabase.
 * Se llama de forma fire-and-forget desde OrderComposer.
 * Si falla, solo se loguea — localStorage sigue como fuente de verdad.
 *
 * Usa metadata.local_id para referenciar el ID local del demo-store,
 * permitiendo encontrar el registro en Supabase para actualizaciones de estado.
 */
export async function syncOrderCreate(
  order: Order,
  restaurantId: string,
  branchId: string | null
): Promise<void> {
  if (!restaurantId) return;

  try {
    const sb = createServerSupabaseClient();

    const total = order.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Insertar placed_order
    const { data: placed, error: orderError } = await sb
      .from("placed_orders")
      .insert({
        restaurant_id:       restaurantId,
        branch_id:           branchId ?? restaurantId.replace(/restaurant/, "branch"),
        waiter_name_snapshot: order.waiter_name,
        status:              order.status,
        total_amount:        total,
        notes:               order.notes ?? null,
        metadata: {
          local_id:    order.id,
          table_label: order.table,
          source:      "demo_store",
        },
      })
      .select("id")
      .single();

    if (orderError || !placed) {
      console.warn("[syncOrderCreate] placed_orders insert failed:", orderError?.message);
      return;
    }

    // Insertar order_items
    const items = order.items.map((item) => ({
      placed_order_id:     placed.id,
      menu_item_id:        isUUID(item.menu_item_id) ? item.menu_item_id : null,
      name_snapshot:       item.name,
      unit_price_snapshot: item.unit_price,
      quantity:            item.quantity,
      station:             item.station,
    }));

    if (items.length > 0) {
      const { error: itemsError } = await sb.from("order_items").insert(items);
      if (itemsError) {
        console.warn("[syncOrderCreate] order_items insert failed:", itemsError.message);
      }
    }
  } catch (err) {
    console.warn("[syncOrderCreate] unexpected error:", err);
  }
}

/**
 * Sincroniza el avance de estado de un pedido hacia Supabase.
 * Busca por metadata->>'local_id' para no necesitar almacenar el UUID de Supabase.
 */
export async function syncOrderStatusUpdate(
  localOrderId: string,
  newStatus: Order["status"],
  restaurantId: string
): Promise<void> {
  if (!restaurantId) return;

  try {
    const sb = createServerSupabaseClient();
    const { error } = await sb
      .from("placed_orders")
      .update({ status: newStatus })
      .eq("restaurant_id", restaurantId)
      .contains("metadata", { local_id: localOrderId });

    if (error) {
      console.warn("[syncOrderStatusUpdate] update failed:", error.message);
    }
  } catch (err) {
    console.warn("[syncOrderStatusUpdate] unexpected error:", err);
  }
}

// Helper: detecta si un string es un UUID v4 válido
function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

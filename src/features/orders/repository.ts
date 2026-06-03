/**
 * Orders repository — capa de lectura desde Supabase.
 * Sigue el mismo patrón que features/reservations/repository.ts:
 * - Intenta Supabase primero.
 * - Si falla o no está configurado, devuelve array vacío (el demo-store usa localStorage como fallback).
 *
 * NUNCA importar desde componentes cliente — solo desde server components y server actions.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "./types";
import type { KitchenStation } from "@/features/kitchen/types";

// ─── Tipos internos de la DB ────────────────────────────────────────────────

type PlacedOrderRow = {
  id: string;
  restaurant_id: string;
  branch_id: string;
  waiter_name_snapshot: string | null;
  status: string;
  total_amount: number;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  placed_order_id: string;
  menu_item_id: string | null;
  name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  station: string;
};

// ─── Mapeo DB → tipos de la app ─────────────────────────────────────────────

function mapOrderRow(
  row: PlacedOrderRow,
  items: OrderItemRow[]
): Order {
  const meta = (row.metadata ?? {}) as Record<string, string>;

  return {
    // Preferir el local_id del metadata para mantener consistencia con el demo-store.
    // Si no existe (orden creada externamente), usar el UUID de Supabase.
    id: meta.local_id || row.id,

    restaurant_id: row.restaurant_id,
    branch_id:     row.branch_id,
    table:         meta.table_label || "Mesa",
    status:        row.status as Order["status"],
    created_at:    row.created_at,
    waiter_name:   row.waiter_name_snapshot ?? "—",
    notes:         row.notes ?? undefined,

    items: items
      .filter((i) => i.placed_order_id === row.id)
      .map((i): OrderItem => ({
        menu_item_id: i.menu_item_id ?? i.id,
        name:         i.name_snapshot,
        quantity:     i.quantity,
        unit_price:   i.unit_price_snapshot,
        station:      i.station as KitchenStation,
      })),
  };
}

// ─── Queries públicas ────────────────────────────────────────────────────────

export interface OrdersResult {
  orders: Order[];
  source: "supabase" | "fallback";
}

/**
 * Lee los pedidos activos (no cancelados) de las últimas 24 horas
 * para un restaurante/sucursal desde Supabase.
 * Devuelve { orders: [], source: "fallback" } si Supabase no está disponible.
 */
export async function getOrdersByRestaurant(
  restaurantId: string,
  branchId?: string | null,
  options: { includeDelivered?: boolean; limitHours?: number } = {}
): Promise<OrdersResult> {
  const { includeDelivered = true, limitHours = 24 } = options;

  if (!restaurantId) return { orders: [], source: "fallback" };

  try {
    const sb  = createServerSupabaseClient();
    const since = new Date(Date.now() - limitHours * 60 * 60 * 1000).toISOString();

    // 1. Traer placed_orders
    let ordersQuery = sb
      .from("placed_orders")
      .select("id, restaurant_id, branch_id, waiter_name_snapshot, status, total_amount, notes, metadata, created_at")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(100);

    if (branchId) {
      ordersQuery = ordersQuery.eq("branch_id", branchId);
    }
    if (!includeDelivered) {
      ordersQuery = ordersQuery.neq("status", "delivered");
    }

    const { data: orderRows, error: ordersError } = await ordersQuery;

    if (ordersError || !orderRows?.length) {
      return { orders: [], source: "fallback" };
    }

    // 2. Traer order_items de todos los pedidos
    const orderIds = orderRows.map((r) => r.id);
    const { data: itemRows, error: itemsError } = await sb
      .from("order_items")
      .select("id, placed_order_id, menu_item_id, name_snapshot, unit_price_snapshot, quantity, station")
      .in("placed_order_id", orderIds);

    if (itemsError) {
      console.warn("[getOrdersByRestaurant] order_items fetch failed:", itemsError.message);
    }

    const items = (itemRows ?? []) as OrderItemRow[];
    const orders = (orderRows as PlacedOrderRow[]).map((row) => mapOrderRow(row, items));

    return { orders, source: "supabase" };
  } catch (err) {
    console.warn("[getOrdersByRestaurant] unexpected error:", err);
    return { orders: [], source: "fallback" };
  }
}

/**
 * ¿Hay pedidos en Supabase para este restaurante en las últimas 24 horas?
 * Útil para decidir si hidratar localStorage desde Supabase o dejar los seeds demo.
 */
export async function hasSupabaseOrders(restaurantId: string): Promise<boolean> {
  if (!restaurantId) return false;
  try {
    const sb    = createServerSupabaseClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await sb
      .from("placed_orders")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .gte("created_at", since);
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

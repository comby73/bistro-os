"use client";

import { useEffect, useMemo } from "react";
import { groupOrdersByStatus, getNextOrderStatus } from "@/features/orders/calculations";
import { useDemoClock } from "@/features/orders/demo-clock";
import { useDemoOrders, hydrateFromSupabase } from "@/features/orders/demo-store";
import { syncOrderStatusUpdate } from "@/features/orders/order-actions";
import type { Order } from "@/features/orders/types";
import type { RoleId } from "@/features/auth/roles";
import { KitchenTicketCard } from "./KitchenTicketCard";

const statusConfig = [
  {
    status: "received",
    label: "Recibidos",
    labelColor: "text-sky-300",
    countColor: "text-sky-300",
    border: "border-sky-300/20",
    headerBorder: "border-sky-300/25",
    bg: "bg-sky-300/[0.04]"
  },
  {
    status: "preparing",
    label: "En preparación",
    labelColor: "text-amber-400",
    countColor: "text-amber-400",
    border: "border-amber-400/20",
    headerBorder: "border-amber-400/30",
    bg: "bg-amber-400/[0.04]"
  },
  {
    status: "ready",
    label: "Listos",
    labelColor: "text-emerald-400",
    countColor: "text-emerald-400",
    border: "border-emerald-400/20",
    headerBorder: "border-emerald-400/25",
    bg: "bg-emerald-400/[0.04]"
  },
  {
    status: "delivered",
    label: "Entregados",
    labelColor: "text-paper",
    countColor: "text-paper/60",
    border: "border-line",
    headerBorder: "border-line",
    bg: "bg-layer1/40"
  }
] as const;

interface Props {
  roleId: RoleId;
  restaurantId?: string;
  branchId?: string | null;
  supabaseOrders?: Order[];
}

export function KitchenBoard({ roleId, restaurantId, branchId, supabaseOrders = [] }: Props) {
  const { orders, advanceOrderStatus } = useDemoOrders(restaurantId);
  const currentTime   = useDemoClock();
  const groupedOrders = useMemo(() => groupOrdersByStatus(orders), [orders]);
  const canAdvance    = roleId === "kitchen" || roleId === "owner" || roleId === "admin";

  // Hidratar desde Supabase si localStorage vacío
  useEffect(() => {
    if (restaurantId && supabaseOrders.length > 0) {
      hydrateFromSupabase(restaurantId, supabaseOrders);
    }
  }, [restaurantId, supabaseOrders]);

  function handleAdvance(order: Order) {
    const fromStatus = order.status;
    const nextStatus = getNextOrderStatus(order.status);

    // 1. Actualizar localStorage inmediatamente (UX responsivo)
    advanceOrderStatus(order.id);

    // 2. Sync a Supabase en background con fromStatus para kitchen_events
    if (nextStatus && restaurantId) {
      syncOrderStatusUpdate(
        order.id,
        fromStatus,
        nextStatus,
        restaurantId,
        branchId ?? null
      ).catch(() => {
        // fire-and-forget: localStorage es la fuente de verdad en caso de fallo
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {statusConfig.map((column) => (
          <div
            key={column.status}
            className={`rounded-3xl border p-5 ${column.border} ${column.bg}`}
          >
            <p className={`text-xs uppercase tracking-[0.18em] ${column.labelColor}/70`}>
              {column.label}
            </p>
            <p className={`mt-3 text-4xl font-semibold tracking-[-0.05em] ${column.countColor}`}>
              {groupedOrders[column.status].length}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        {statusConfig.map((column) => (
          <section
            key={column.status}
            className={`rounded-[28px] border p-4 ${column.border} bg-layer1/40`}
          >
            <div
              className={`mb-4 flex items-center justify-between gap-3 border-b pb-4 ${column.headerBorder}`}
            >
              <h3
                className={`text-sm font-semibold uppercase tracking-[0.18em] ${column.labelColor}`}
              >
                {column.label}
              </h3>
              <span
                className={`rounded-full border px-3 py-1 text-xs ${column.border} ${column.countColor}/60`}
              >
                {groupedOrders[column.status].length}
              </span>
            </div>
            <div className="space-y-4">
              {groupedOrders[column.status].map((order) => (
                <KitchenTicketCard
                  key={order.id}
                  order={order}
                  currentTime={currentTime}
                  canAdvance={canAdvance}
                  onAdvance={() => handleAdvance(order)}
                />
              ))}

              {groupedOrders[column.status].length === 0 && (
                <div className="rounded-2xl border border-dashed border-line p-5 text-sm text-paper/42">
                  Sin pedidos en esta columna.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

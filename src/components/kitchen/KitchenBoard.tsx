"use client";

import { useMemo } from "react";
import { groupOrdersByStatus, KITCHEN_ACTIVE_STATUSES } from "@/features/orders/calculations";
import { useDemoClock } from "@/features/orders/demo-clock";
import { useDemoOrders } from "@/features/orders/demo-store";
import type { RoleId } from "@/features/auth/roles";
import { KitchenTicketCard } from "./KitchenTicketCard";

const statusConfig = [
  { status: "received", label: "Recibidos" },
  { status: "preparing", label: "En preparación" },
  { status: "ready", label: "Listos" }
] as const;

export function KitchenBoard({ roleId }: { roleId: RoleId }) {
  const { orders, advanceOrderStatus } = useDemoOrders();
  const currentTime = useDemoClock();
  const groupedOrders = useMemo(
    () => groupOrdersByStatus(orders.filter((order) => KITCHEN_ACTIVE_STATUSES.includes(order.status))),
    [orders]
  );
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;
  const canAdvance = roleId === "kitchen" || roleId === "owner" || roleId === "admin";

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {statusConfig.map((column) => (
          <div key={column.status} className="rounded-3xl border border-line bg-layer1/60 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/45">{column.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">
              {groupedOrders[column.status].length}
            </p>
          </div>
        ))}
        <div className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Entregados</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">{deliveredCount}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {statusConfig.map((column) => (
          <section key={column.status} className="rounded-[28px] border border-line bg-layer1/55 p-4">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {column.label}
              </h3>
              <span className="rounded-full border border-line px-3 py-1 text-xs text-paper/50">
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
                  onAdvance={() => advanceOrderStatus(order.id)}
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

"use client";

import { useMemo } from "react";
import { getElapsedMinutes, sortOrdersByNewest } from "@/features/orders/calculations";
import { useDemoClock } from "@/features/orders/demo-clock";
import { useDemoOrders } from "@/features/orders/demo-store";
import { OrderCard } from "./OrderCard";

export function OrdersManagementBoard({ restaurantId }: { restaurantId?: string }) {
  const { orders } = useDemoOrders(restaurantId);
  const currentTime = useDemoClock();
  const sortedOrders = useMemo(() => sortOrdersByNewest(orders), [orders]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Recibidos</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">
            {orders.filter((order) => order.status === "received").length}
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">En preparación</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">
            {orders.filter((order) => order.status === "preparing").length}
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Listos</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">
            {orders.filter((order) => order.status === "ready").length}
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Entregados</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-gold">
            {orders.filter((order) => order.status === "delivered").length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {sortedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            elapsedMinutes={getElapsedMinutes(order.created_at, currentTime)}
          />
        ))}
      </div>
    </section>
  );
}

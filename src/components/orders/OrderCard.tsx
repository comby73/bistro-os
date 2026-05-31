import {
  formatOrderCreatedAt,
  getOrderStatusLabel,
  getOrderTotal
} from "@/features/orders/calculations";
import type { Order } from "@/features/orders/types";
import { formatArsFromUsd } from "@/lib/utils";

export function OrderCard({
  order,
  elapsedMinutes
}: {
  order: Order;
  elapsedMinutes?: number;
}) {
  return (
    <article className="rounded-3xl border border-line bg-layer1/55 p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{order.id}</h3>
          <p className="mt-1 text-sm text-paper/60">
            {order.table} · {formatOrderCreatedAt(order.created_at)} · {order.waiter_name}
          </p>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold">
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-paper/42">
        <span>{formatArsFromUsd(getOrderTotal(order))}</span>
        {typeof elapsedMinutes === "number" && <span>{elapsedMinutes} min</span>}
      </div>

      <ul className="space-y-3 text-sm text-paper/70">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.name}`} className="flex justify-between border-b border-line pb-3">
            <span>{item.quantity}× {item.name}</span>
            <span className="text-mute">{item.station}</span>
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="mt-5 rounded-2xl border border-line bg-ink/60 p-4 text-sm text-paper/60">
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Notas</span>
          {order.notes}
        </div>
      )}
    </article>
  );
}

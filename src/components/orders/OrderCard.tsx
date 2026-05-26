import type { Order } from "@/features/orders/types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="card-premium p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{order.id}</h3>
          <p className="text-sm text-paper/60">{order.table} · {order.created_at}</p>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
          {order.status}
        </span>
      </div>
      <ul className="space-y-2 text-sm text-paper/70">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.name}`} className="flex justify-between border-b border-line pb-2">
            <span>{item.quantity}× {item.name}</span>
            <span className="text-mute">{item.station}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

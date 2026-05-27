import {
  formatOrderCreatedAt,
  getElapsedMinutes,
  getNextOrderStatus,
  getOrderStatusLabel
} from "@/features/orders/calculations";
import type { Order } from "@/features/orders/types";

export function KitchenTicketCard({
  order,
  currentTime,
  canAdvance,
  onAdvance
}: {
  order: Order;
  currentTime: number;
  canAdvance: boolean;
  onAdvance: () => void;
}) {
  const elapsedMinutes = getElapsedMinutes(order.created_at, currentTime);
  const delayed = elapsedMinutes >= 12;
  const nextStatus = getNextOrderStatus(order.status);
  const actionLabel =
    order.status === "received"
      ? "Comenzar"
      : order.status === "preparing"
        ? "Marcar listo"
        : order.status === "ready"
          ? "Entregar"
          : "Pedido finalizado";

  return (
    <article
      className={
        delayed
          ? "rounded-[26px] border border-gold/45 bg-gold/10 p-6"
          : "rounded-[26px] border border-line bg-ink/85 p-6"
      }
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">{order.table}</h3>
          <p className="mt-1 text-sm text-paper/50">
            {order.id} · {formatOrderCreatedAt(order.created_at)} · {order.waiter_name}
          </p>
        </div>
        <div className="text-right">
          <p className={delayed ? "text-3xl font-semibold text-gold" : "text-3xl font-semibold"}>
            {elapsedMinutes}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-paper/45">min</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-gold">
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <ul className="space-y-3 text-base text-paper/78">
        {order.items.map((item) => (
          <li key={`${order.id}-${item.menu_item_id}`} className="flex items-start justify-between gap-3">
            <span>{item.quantity}× {item.name}</span>
            <span className="text-sm uppercase tracking-[0.14em] text-paper/35">{item.station}</span>
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="mt-5 rounded-2xl border border-line bg-layer1/40 p-4 text-sm text-paper/58">
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/40">Notas</span>
          {order.notes}
        </div>
      )}

      <button
        type="button"
        disabled={!canAdvance || !nextStatus}
        onClick={onAdvance}
        className="mt-5 w-full rounded-2xl border border-gold/35 bg-gold/12 px-4 py-4 text-sm font-semibold text-gold transition hover:border-gold/55 hover:bg-gold/18 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {nextStatus ? actionLabel : "Pedido finalizado"}
      </button>
    </article>
  );
}

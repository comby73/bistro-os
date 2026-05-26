import type { KitchenTicket } from "@/features/kitchen/types";

export function KitchenTicketCard({ ticket }: { ticket: KitchenTicket }) {
  const delayed = ticket.elapsed_minutes >= 12;

  return (
    <article className={delayed ? "rounded-2xl border border-gold/50 bg-gold/10 p-5" : "card-premium p-5"}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{ticket.order_id}</h3>
          <p className="text-sm text-paper/60">{ticket.table} · {ticket.station}</p>
        </div>
        <span className={delayed ? "text-sm font-semibold text-gold" : "text-sm text-paper/60"}>
          {ticket.elapsed_minutes} min
        </span>
      </div>

      <ul className="space-y-2 text-sm text-paper/75">
        {ticket.items.map((item) => (
          <li key={item}>→ {item}</li>
        ))}
      </ul>

      <button className="btn-ghost mt-5 w-full px-4 py-2 text-xs">
        Marcar avance
      </button>
    </article>
  );
}

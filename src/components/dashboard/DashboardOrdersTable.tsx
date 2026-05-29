"use client";

const STATUS_COLORS: Record<string, string> = {
  received:   "bg-amber-400/15 text-amber-300",
  preparing:  "bg-sky-400/15 text-sky-300",
  ready:      "bg-emerald-400/15 text-emerald-300",
  delivered:  "bg-paper/10 text-paper/60",
  cancelled:  "bg-red-400/10 text-red-400/80"
};

export function DashboardOrdersTable({
  orders
}: {
  orders: Array<{ id: string; table: string; amount: number; status: string }>;
}) {
  return (
    <section className="card-premium overflow-hidden">
      <div className="border-b border-line px-6 py-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-paper">Pedidos recientes</h2>
      </div>
      <div className="divide-y divide-line">
        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-4 items-center gap-4 px-6 py-4 transition-colors hover:bg-layer2/40">
            <span className="text-[15px] font-semibold text-paper">{order.id}</span>
            <span className="text-[15px] text-paper/78">{order.table}</span>
            <span className="text-[16px] font-bold text-gold">USD {order.amount}</span>
            <div className="flex justify-end">
              <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.10em] ${STATUS_COLORS[order.status] ?? "bg-paper/10 text-paper/60"}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

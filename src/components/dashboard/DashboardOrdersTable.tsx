"use client";

export function DashboardOrdersTable({
  orders
}: {
  orders: Array<{ id: string; table: string; amount: number; status: string }>;
}) {
  return (
    <section className="card-premium overflow-hidden">
      <div className="border-b border-line p-6">
        <h2 className="text-lg font-semibold">Pedidos recientes</h2>
      </div>
      <div className="divide-y divide-line">
        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-4 gap-4 p-5 text-sm">
            <span className="font-medium">{order.id}</span>
            <span className="text-paper/65">{order.table}</span>
            <span className="text-gold">USD {order.amount}</span>
            <span className="text-right text-paper/65">{order.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { AppShell } from "@/components/layout/AppShell";
import { OrderCard } from "@/components/orders/OrderCard";
import { orders } from "@/features/orders/mock-data";

export default function OrdersPage() {
  return (
    <AppShell currentPath="/orders">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Pedidos</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Pedidos activos.
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

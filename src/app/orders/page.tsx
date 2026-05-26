import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderCard } from "@/components/orders/OrderCard";
import { orders } from "@/features/orders/mock-data";

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-12">
          <div className="mb-10">
            <p className="eyebrow mb-3">Pedidos</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Pedidos activos.
            </h1>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { dashboardMetrics, operationalSummary } from "@/features/analytics/mock-data";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-12">
          <div className="mb-10">
            <p className="eyebrow mb-3">Dashboard MVP</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Panel operativo de Bistró OS.
            </h1>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Ventas hoy" value={`USD ${dashboardMetrics.revenueToday}`} hint="Dato mockeado para demo." />
            <MetricCard label="Pedidos activos" value={String(dashboardMetrics.activeOrders)} hint="Pedidos en preparación o pendientes." />
            <MetricCard label="Reservas pendientes" value={String(dashboardMetrics.pendingReservations)} hint="Reservas que requieren confirmación." />
            <MetricCard label="Ticket promedio" value={`USD ${dashboardMetrics.averageTicket}`} hint="Estimado del servicio actual." />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <OrdersTable />
            <section className="card-premium p-6">
              <p className="eyebrow mb-4">Resumen IA mock</p>
              <h2 className="mb-4 text-lg font-semibold">Lectura operativa</h2>
              <p className="text-sm leading-7 text-paper/62">{operationalSummary}</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

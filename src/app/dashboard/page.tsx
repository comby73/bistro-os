import Link from "next/link";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { dashboardMetrics, operationalSummary } from "@/features/analytics/mock-data";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";
import { kitchenTickets } from "@/features/kitchen/mock-data";
import { orders } from "@/features/orders/mock-data";
import { reservations } from "@/features/reservations/mock-data";

function QuickAccessCard({
  title,
  description,
  href,
  cta
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="card-premium p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-paper/60">{description}</p>
      <Link href={href} className="mt-6 inline-flex text-sm text-gold transition hover:text-paper">
        {cta}
      </Link>
    </article>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;
  const pendingOrders = orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length;
  const pendingReservations = reservations.filter((reservation) => reservation.status === "pending").length;
  const readyPass = kitchenTickets.filter((ticket) => ticket.status === "ready").length;

  return (
    <AppShell currentPath="/dashboard">
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">Dashboard</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {role ? `Vista interna para ${role.label}.` : "Vista interna del sistema."}
          </h2>
        </div>

        {(role?.id === "owner" || role?.id === "admin") && (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Ventas hoy" value={`USD ${dashboardMetrics.revenueToday}`} hint="Dato mockeado para demo." />
              <MetricCard label="Pedidos activos" value={String(dashboardMetrics.activeOrders)} hint="Pedidos en preparación o pendientes." />
              <MetricCard label="Reservas pendientes" value={String(dashboardMetrics.pendingReservations)} hint="Reservas que requieren confirmación." />
              <MetricCard label="Ticket promedio" value={`USD ${dashboardMetrics.averageTicket}`} hint="Estimado del servicio actual." />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <OrdersTable />
              <div className="space-y-6">
                <section className="card-premium p-6">
                  <p className="eyebrow mb-4">Lectura ejecutiva</p>
                  <h3 className="mb-4 text-lg font-semibold">Resumen del servicio</h3>
                  <p className="text-sm leading-7 text-paper/62">{operationalSummary}</p>
                </section>
                <div className="grid gap-4 md:grid-cols-2">
                  <QuickAccessCard
                    title="Ver pedidos"
                    description="Entrá al tablero operativo para seguir comandas, mozos y tiempos del turno."
                    href="/orders"
                    cta="Abrir pedidos"
                  />
                  <QuickAccessCard
                    title="Abrir cocina"
                    description="Chequeá el KDS y el avance entre recibido, en preparación y listo."
                    href="/kitchen"
                    cta="Abrir cocina"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {role?.id === "manager" && (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <MetricCard label="Pedidos por salir" value={String(pendingOrders)} hint="Mesas con tickets todavía abiertos." />
              <MetricCard label="Reservas a confirmar" value={String(pendingReservations)} hint="Requieren seguimiento de sala." />
              <MetricCard label="Pase listo" value={String(readyPass)} hint="Platos listos para coordinar entrega." />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <QuickAccessCard
                title="Reservas del turno"
                description="Chequeá confirmaciones, observaciones especiales y tamaño de mesa antes del pico."
                href="/reservations"
                cta="Ir a reservas"
              />
              <QuickAccessCard
                title="Pedidos en curso"
                description="Seguí el ritmo de mesas activas y detectá cuellos de botella entre salón y cocina."
                href="/orders"
                cta="Ir a pedidos"
              />
              <section className="card-premium p-6">
                <p className="eyebrow mb-4">Foco del turno</p>
                <p className="text-sm leading-7 text-paper/60">
                  Priorizá la franja de 20:00 a 21:00, revisá aniversarios y asegurá coordinación con barra y parrilla.
                </p>
              </section>
            </div>
          </>
        )}

        {role?.id === "waiter" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <QuickAccessCard
              title="Tomar y seguir pedidos"
              description="Entrá directo al módulo de pedidos para revisar estados, mesas activas y comandas pendientes."
              href="/orders"
              cta="Abrir pedidos"
            />
            <QuickAccessCard
              title="Consultar menú vigente"
              description="Chequeá platos, categorías y precios antes de cargar nuevas mesas o responder dudas."
              href="/menu"
              cta="Abrir menú"
            />
          </div>
        )}

        {role?.id === "kitchen" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <QuickAccessCard
              title="Abrir cocina"
              description="Entrá al KDS para ver tickets por estación, tiempos y prioridades del servicio actual."
              href="/kitchen"
              cta="Ir a cocina"
            />
            <section className="card-premium p-6">
              <p className="eyebrow mb-4">Estado del pase</p>
              <h3 className="text-3xl font-semibold text-gold">{readyPass}</h3>
              <p className="mt-3 text-sm leading-7 text-paper/60">
                Tickets listos para coordinar salida a salón en este corte del servicio.
              </p>
            </section>
          </div>
        )}

        {!role && (
          <div className="mb-10">
            <p className="text-sm text-paper/60">
              Esta vista requiere seleccionar un rol demo desde el login.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}

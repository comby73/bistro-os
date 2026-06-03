"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDemoClock } from "@/features/orders/demo-clock";
import { useDemoOrders } from "@/features/orders/demo-store";
import { useDemoReservations } from "@/features/reservations/demo-store";
import type { RoleId } from "@/features/auth/roles";
import {
  buildExecutiveSummary,
  buildManagerSnapshot,
  buildOwnerAdminMetrics,
  getDashboardAlerts,
  getKitchenCounts,
  getLatestOperationalOrders
} from "@/features/dashboard/calculations";
import { DashboardAlertList } from "./DashboardAlertList";
import { DashboardOrdersTable } from "./DashboardOrdersTable";
import { PublicityBanner } from "./PublicityBanner";
import { formatArsFromUsd } from "@/lib/utils";

const FALLBACK_NOW = Date.parse("2026-01-01T12:00:00Z");

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
      <h2 className="text-[20px] font-bold tracking-[-0.02em] text-paper">{title}</h2>
      <p className="mt-3 text-[15px] leading-7 text-paper/72">{description}</p>
      <Link href={href} className="mt-6 inline-flex text-[15px] font-medium text-gold transition hover:text-paper">
        {cta}
      </Link>
    </article>
  );
}

export function DashboardWorkspace({
  roleId,
  roleLabel,
  restaurantId,
  restaurantName,
  restaurantSlug,
  heroImages,
}: {
  roleId: RoleId;
  roleLabel: string;
  restaurantId?: string;
  restaurantName?: string;
  restaurantSlug?: string;
  heroImages?: string[];
}) {
  const { orders } = useDemoOrders(restaurantId);
  const { reservations } = useDemoReservations({ restaurantId });
  const currentTime = useDemoClock();
  const effectiveNow = currentTime > 0 ? currentTime : FALLBACK_NOW;
  const today = new Date(effectiveNow).toISOString().slice(0, 10);
  const nowTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(effectiveNow));

  const ownerAdminMetrics = useMemo(
    () => buildOwnerAdminMetrics(orders, reservations),
    [orders, reservations]
  );
  const alerts = useMemo(
    () => getDashboardAlerts(orders, reservations, effectiveNow),
    [effectiveNow, orders, reservations]
  );
  const kitchenCounts = useMemo(() => getKitchenCounts(orders), [orders]);
  const latestOrders = useMemo(() => getLatestOperationalOrders(orders), [orders]);
  const executiveSummary = useMemo(
    () => buildExecutiveSummary(orders, reservations, effectiveNow),
    [effectiveNow, orders, reservations]
  );
  const managerSnapshot = useMemo(
    () => buildManagerSnapshot(orders, reservations, today, nowTime, effectiveNow),
    [effectiveNow, nowTime, orders, reservations, today]
  );

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Dashboard</p>
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl lg:text-5xl">
          Vista interna para {roleLabel}.
        </h2>
        {restaurantName && (
          <p className="mt-2 text-[15px] text-paper/65">
            Operando en <span className="font-semibold text-gold">{restaurantName}</span>
          </p>
        )}
      </div>

      {(roleId === "owner" || roleId === "admin") && (
        <>
          <PublicityBanner
            canEdit={roleId === "owner" || roleId === "admin"}
            restaurantSlug={restaurantSlug}
            restaurantName={restaurantName}
            heroImages={heroImages}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard accent="gold" label="Ventas hoy" value={formatArsFromUsd(ownerAdminMetrics.revenueToday)} hint="Total estimado del turno activo." />
            <MetricCard accent="sky" label="Pedidos activos" value={String(ownerAdminMetrics.activeOrders)} hint="Comandas vivas en salón y cocina." />
            <MetricCard accent="amber" label="Reservas pendientes" value={String(ownerAdminMetrics.pendingReservations)} hint="Requieren confirmación del salón." />
            <MetricCard accent="muted" label="Ticket promedio" value={formatArsFromUsd(ownerAdminMetrics.averageTicket)} hint="Calculado sobre pedidos entregados." />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <DashboardOrdersTable orders={latestOrders} />
            <div className="space-y-6">
              <section className="card-premium p-6">
                <p className="eyebrow mb-4">Lectura ejecutiva</p>
                <h3 className="mb-4 text-[18px] font-bold text-paper">Resumen del servicio</h3>
                <p className="text-[15px] leading-7 text-paper/75">{executiveSummary}</p>
              </section>
              <DashboardAlertList alerts={alerts} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <QuickAccessCard
              title="Pedidos y cocina"
              description={`Recibidos ${kitchenCounts.received}, preparando ${kitchenCounts.preparing}, listos ${kitchenCounts.ready}.`}
              href="/orders"
              cta="Abrir pedidos"
            />
            <QuickAccessCard
              title="Reservas del turno"
              description={`Total activas hoy: ${managerSnapshot.todayReservations.length}. Gestioná confirmaciones y seating.`}
              href="/reservations"
              cta="Ir a reservas"
            />
            <QuickAccessCard
              title="Ventas y caja"
              description="Consultá cierre operativo, medios de pago y pendientes de cobro."
              href="/sales"
              cta="Ir a ventas"
            />
          </div>
        </>
      )}

      {roleId === "manager" && (
        <>
          <div className="grid gap-5 md:grid-cols-4">
            <MetricCard accent="sky" label="Pedidos activos" value={String(managerSnapshot.activeOrders)} hint="Comandas vivas del turno." />
            <MetricCard accent="gold" label="Reservas de hoy" value={String(managerSnapshot.todayReservations.length)} hint="Agenda del servicio actual." />
            <MetricCard accent="amber" label="Tickets demorados" value={String(managerSnapshot.delayedOrders)} hint="Pedidos sobre el umbral operativo." />
            <MetricCard accent="emerald" label="Listos sin entregar" value={String(managerSnapshot.readyOrders)} hint="Pedidos listos para coordinar salida." />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="card-premium p-6">
              <p className="eyebrow mb-4">Próxima reserva</p>
              {managerSnapshot.nextReservation ? (
                <>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                    {managerSnapshot.nextReservation.time}
                  </h3>
                  <p className="mt-3 text-sm text-paper/62">
                    {managerSnapshot.nextReservation.customer_name} · {managerSnapshot.nextReservation.party_size} personas
                  </p>
                  <p className="mt-2 text-sm text-paper/50">
                    {managerSnapshot.nextReservation.table_assigned ?? "Mesa sin asignar"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-paper/55">No hay reservas próximas en seguimiento inmediato.</p>
              )}
            </section>

            <DashboardAlertList alerts={alerts} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <QuickAccessCard
              title="Reservas del turno"
              description="Chequeá confirmaciones, seating y observaciones del servicio."
              href="/reservations"
              cta="Gestionar reservas"
            />
            <QuickAccessCard
              title="Pedidos activos"
              description="Seguí el ritmo de mesas y detectá cuellos de botella entre salón y cocina."
              href="/orders"
              cta="Ir a pedidos"
            />
            <QuickAccessCard
              title="Tablero de cocina"
              description="Revisá qué comandas siguen en preparación y cuáles están listas."
              href="/kitchen"
              cta="Abrir cocina"
            />
          </div>
        </>
      )}

      {roleId === "waiter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickAccessCard
            title="Tomar pedido"
            description="Entrá al modo servicio para cargar comandas y enviarlas directo a cocina."
            href="/orders"
            cta="Ir a pedidos"
          />
          <QuickAccessCard
            title="Consultar menú"
            description="Chequeá carta, precios y productos disponibles antes de tomar la mesa."
            href="/menu"
            cta="Abrir menú"
          />
        </div>
      )}

      {roleId === "kitchen" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickAccessCard
            title="Abrir cocina"
            description={`Recibidos ${kitchenCounts.received}, preparando ${kitchenCounts.preparing}, listos ${kitchenCounts.ready}.`}
            href="/kitchen"
            cta="Ir a cocina"
          />
          <section className="card-premium p-6">
            <p className="eyebrow mb-4">Estado del pase</p>
            <h3 className="text-3xl font-semibold text-gold">{kitchenCounts.ready}</h3>
            <p className="mt-3 text-sm leading-7 text-paper/60">
              Tickets listos para coordinar salida a salón en este corte del servicio.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}

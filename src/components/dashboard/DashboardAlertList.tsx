"use client";

import type { DashboardAlert } from "@/features/dashboard/calculations";

export function DashboardAlertList({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <section className="card-premium p-6">
      <p className="eyebrow mb-4">Alertas operativas</p>
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={
                alert.tone === "gold"
                  ? "rounded-2xl border border-gold/25 bg-gold/10 p-4"
                  : "rounded-2xl border border-line bg-layer1/55 p-4"
              }
            >
              <p className="font-semibold">{alert.title}</p>
              <p className="mt-2 text-sm text-paper/60">{alert.detail}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-line bg-layer1/55 p-4 text-sm text-paper/55">
            Sin alertas críticas para este corte.
          </div>
        )}
      </div>
    </section>
  );
}

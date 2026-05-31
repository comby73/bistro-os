import { MetricCard } from "@/components/dashboard/MetricCard";
import type { SalesSummary } from "@/features/sales/types";
import { formatArsFromUsd } from "@/lib/utils";

export function SalesSummaryCards({ summary }: { summary: SalesSummary }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Ventas del día"
        value={formatArsFromUsd(summary.totalSales)}
        hint="Solo ventas cobradas en este corte operativo."
      />
      <MetricCard
        label="Ticket promedio"
        value={formatArsFromUsd(summary.averageTicket)}
        hint="Promedio sobre pedidos cobrados."
      />
      <MetricCard
        label="Pedidos cobrados"
        value={String(summary.paidOrdersCount)}
        hint="Cantidad de tickets ya cerrados en caja."
      />
      <MetricCard
        label="Propinas estimadas"
        value={formatArsFromUsd(summary.estimatedTips)}
        hint="Valor simulado para seguimiento de turno."
      />
    </div>
  );
}

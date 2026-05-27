import { MetricCard } from "@/components/dashboard/MetricCard";
import type { SalesSummary } from "@/features/sales/types";

export function SalesSummaryCards({ summary }: { summary: SalesSummary }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Ventas del día"
        value={`USD ${summary.totalSales}`}
        hint="Solo ventas cobradas en este corte operativo."
      />
      <MetricCard
        label="Ticket promedio"
        value={`USD ${summary.averageTicket.toFixed(0)}`}
        hint="Promedio sobre pedidos cobrados."
      />
      <MetricCard
        label="Pedidos cobrados"
        value={String(summary.paidOrdersCount)}
        hint="Cantidad de tickets ya cerrados en caja."
      />
      <MetricCard
        label="Propinas estimadas"
        value={`USD ${summary.estimatedTips}`}
        hint="Valor simulado para seguimiento de turno."
      />
    </div>
  );
}

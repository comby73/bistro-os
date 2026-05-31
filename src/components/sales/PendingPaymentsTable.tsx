import type { SaleRecord } from "@/features/sales/types";
import { formatArsFromUsd } from "@/lib/utils";

export function PendingPaymentsTable({ pendingSales }: { pendingSales: SaleRecord[] }) {
  return (
    <section className="card-premium overflow-hidden">
      <div className="border-b border-line p-6">
        <p className="eyebrow mb-2">Pendientes de cobro</p>
        <h2 className="text-lg font-semibold">Pedidos todavía abiertos</h2>
      </div>

      <div className="divide-y divide-line">
        {pendingSales.map((sale) => (
          <div key={sale.id} className="grid gap-3 p-5 text-sm md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
            <div>
              <p className="font-medium">{sale.orderId}</p>
              <p className="text-paper/58">{sale.tableLabel}</p>
            </div>
            <div className="text-paper/70">
              <p>{sale.cashier}</p>
              <p className="text-paper/50">Cajero asignado</p>
            </div>
            <div className="text-paper/70">
              <p>{sale.paymentMethod}</p>
              <p className="text-paper/50">Medio sugerido</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gold">{formatArsFromUsd(sale.total)}</p>
              <p className="mt-1 text-paper/50">Propina estimada {formatArsFromUsd(sale.tip)}</p>
            </div>
          </div>
        ))}

        {pendingSales.length === 0 && (
          <div className="p-6 text-sm text-paper/60">
            No hay pedidos pendientes de cobro en este corte.
          </div>
        )}
      </div>
    </section>
  );
}

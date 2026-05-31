import { cashExpenses } from "@/features/sales/mock-data";
import type { CashClosingSnapshot } from "@/features/sales/types";
import { formatArsFromUsd } from "@/lib/utils";

export function CashClosingPanel({
  snapshot,
  readOnly
}: {
  snapshot: CashClosingSnapshot;
  readOnly?: boolean;
}) {
  return (
    <section className="card-premium p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Cierre de caja</p>
          <h2 className="text-xl font-semibold">Resumen operativo</h2>
        </div>
        {readOnly && (
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.18em] text-paper/55">
            Solo lectura
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-layer1/60 px-4 py-3">
          <span className="text-sm text-paper/62">Caja inicial</span>
          <span className="font-semibold">{formatArsFromUsd(snapshot.openingCash)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-layer1/60 px-4 py-3">
          <span className="text-sm text-paper/62">Ventas en efectivo</span>
          <span className="font-semibold text-gold">{formatArsFromUsd(snapshot.cashSales)}</span>
        </div>
        <div className="rounded-2xl border border-line bg-layer1/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-paper/62">Salidas de caja</span>
            <span className="font-semibold">{formatArsFromUsd(snapshot.cashExpenses)}</span>
          </div>
          <div className="space-y-2 text-sm text-paper/58">
            {cashExpenses.map((expense) => (
              <div key={expense.label} className="flex items-center justify-between">
                <span>{expense.label}</span>
                <span>{formatArsFromUsd(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gold/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gold/80">Esperado al cierre</p>
          <p className="mt-2 text-3xl font-semibold text-gold">{formatArsFromUsd(snapshot.expectedCash)}</p>
        </div>
      </div>
    </section>
  );
}

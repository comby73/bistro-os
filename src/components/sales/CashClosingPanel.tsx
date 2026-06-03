import type { CashClosingSnapshot, CashMovement } from "@/features/sales/types";
import { formatArsFromUsd } from "@/lib/utils";

// Gastos de caja demo fijos — representan salidas manuales del turno.
// En producción estos se registran desde la UI de caja.
const DEMO_EXPENSES: CashMovement[] = [
  { label: "Reposición de caja chica", amount: 40 },
  { label: "Compra urgente de hielo",  amount: 18 },
];

export function CashClosingPanel({
  snapshot,
  readOnly,
  expenses = DEMO_EXPENSES,
}: {
  snapshot: CashClosingSnapshot;
  readOnly?: boolean;
  expenses?: CashMovement[];
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
          <span className="text-sm text-paper/62">Ventas en efectivo (pedidos entregados)</span>
          <span className="font-semibold text-gold">{formatArsFromUsd(snapshot.cashSales)}</span>
        </div>
        <div className="rounded-2xl border border-line bg-layer1/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-paper/62">Salidas de caja</span>
            <span className="font-semibold">{formatArsFromUsd(snapshot.cashExpenses)}</span>
          </div>
          {expenses.length > 0 ? (
            <div className="space-y-2 text-sm text-paper/58">
              {expenses.map((expense) => (
                <div key={expense.label} className="flex items-center justify-between">
                  <span>{expense.label}</span>
                  <span>{formatArsFromUsd(expense.amount)}</span>
                </div>
              ))}
              <p className="pt-1 text-[11px] text-paper/35 italic">
                Gastos demo — en producción se registran desde la UI de caja.
              </p>
            </div>
          ) : (
            <p className="text-sm text-paper/45">Sin salidas registradas en este turno.</p>
          )}
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gold/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gold/80">Esperado al cierre</p>
          <p className="mt-2 text-3xl font-semibold text-gold">{formatArsFromUsd(snapshot.expectedCash)}</p>
        </div>
      </div>
    </section>
  );
}

import type { PaymentMethodTotal } from "@/features/sales/types";

export function PaymentMethodsBreakdown({
  paymentMethods
}: {
  paymentMethods: PaymentMethodTotal[];
}) {
  return (
    <section className="card-premium p-6">
      <div className="mb-6">
        <p className="eyebrow mb-3">Medios de pago</p>
        <h2 className="text-xl font-semibold">Breakdown del día</h2>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((item) => (
          <div key={item.method} className="rounded-2xl border border-line bg-layer1/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-paper/58">{item.ordersCount} operaciones cobradas</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gold">USD {item.amount}</p>
                <p className="mt-1 text-sm text-paper/58">{item.percentage.toFixed(0)}% del total</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                style={{ width: `${Math.max(item.percentage, item.amount > 0 ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

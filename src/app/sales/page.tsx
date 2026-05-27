import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { CashClosingPanel } from "@/components/sales/CashClosingPanel";
import { PaymentMethodsBreakdown } from "@/components/sales/PaymentMethodsBreakdown";
import { PendingPaymentsTable } from "@/components/sales/PendingPaymentsTable";
import { SalesReportActions } from "@/components/sales/SalesReportActions";
import { SalesSummaryCards } from "@/components/sales/SalesSummaryCards";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";
import {
  calculateCashClosingSnapshot,
  calculatePaymentMethodTotals,
  calculateSalesSummary,
  getPendingSales
} from "@/features/sales/calculations";

export default async function SalesPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;
  const readOnly = role?.id === "manager";

  return (
    <AppShell currentPath="/sales">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Ventas y caja</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Facturación operativa simulada.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-paper/60">
              Seguimiento de ventas cobradas, pendientes, medios de pago y cierre
              diario sin facturación fiscal real.
            </p>
          </div>
          {readOnly && (
            <div className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm text-paper/60">
              Vista solo lectura para Jefe de sala.
            </div>
          )}
        </div>

        <SalesSummaryCards summary={calculateSalesSummary()} />

        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <PaymentMethodsBreakdown paymentMethods={calculatePaymentMethodTotals()} />
          <CashClosingPanel snapshot={calculateCashClosingSnapshot()} readOnly={readOnly} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <PendingPaymentsTable pendingSales={getPendingSales()} />
          <SalesReportActions readOnly={readOnly} />
        </div>
      </section>
    </AppShell>
  );
}

"use client";

import { useMemo } from "react";
import { useDemoOrders } from "@/features/orders/demo-store";
import {
  buildSalesFromOrders,
  calculateCashClosingSnapshot,
  calculatePaymentMethodTotals,
  calculateSalesSummary,
  getPendingSales,
} from "@/features/sales/calculations";
import { CashClosingPanel } from "./CashClosingPanel";
import { PaymentMethodsBreakdown } from "./PaymentMethodsBreakdown";
import { PendingPaymentsTable } from "./PendingPaymentsTable";
import { SalesReportActions } from "./SalesReportActions";
import { SalesSummaryCards } from "./SalesSummaryCards";

interface Props {
  readOnly: boolean;
  restaurantId?: string;
}

export function SalesWorkspace({ readOnly, restaurantId }: Props) {
  // Pedidos reales del restaurante activo (localStorage por restaurant_id)
  const { orders } = useDemoOrders(restaurantId);

  // Derivar registros de venta desde los pedidos reales
  const salesRecords = useMemo(() => buildSalesFromOrders(orders), [orders]);

  // Calcular métricas en base a pedidos reales
  const summary        = useMemo(() => calculateSalesSummary(salesRecords),        [salesRecords]);
  const paymentMethods = useMemo(() => calculatePaymentMethodTotals(salesRecords), [salesRecords]);
  const cashSnapshot   = useMemo(() => calculateCashClosingSnapshot(salesRecords), [salesRecords]);
  const pendingSales   = useMemo(() => getPendingSales(salesRecords),               [salesRecords]);

  const deliveredCount = salesRecords.filter((s) => s.paymentStatus === "paid").length;
  const pendingCount   = salesRecords.filter((s) => s.paymentStatus === "pending").length;

  return (
    <>
      {/* Indicador de fuente de datos */}
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-emerald-300 font-medium">
          Conectado a pedidos reales del restaurante
        </span>
        <span className="ml-auto text-paper/50">
          {deliveredCount} entregados · {pendingCount} abiertos
        </span>
      </div>

      <SalesSummaryCards summary={summary} />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <PaymentMethodsBreakdown paymentMethods={paymentMethods} />
        <CashClosingPanel snapshot={cashSnapshot} readOnly={readOnly} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PendingPaymentsTable pendingSales={pendingSales} />
        <SalesReportActions readOnly={readOnly} />
      </div>
    </>
  );
}

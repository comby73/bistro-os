import { cashExpenses, openingCashAmount, salesRecords } from "./mock-data";
import type {
  CashClosingSnapshot,
  PaymentMethod,
  PaymentMethodTotal,
  SaleRecord,
  SalesSummary
} from "./types";

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  wallet: "Billetera"
};

export function getPaidSales(records: SaleRecord[] = salesRecords): SaleRecord[] {
  return records.filter((record) => record.paymentStatus === "paid");
}

export function getPendingSales(records: SaleRecord[] = salesRecords): SaleRecord[] {
  return records.filter((record) => record.paymentStatus === "pending");
}

export function calculateSalesSummary(records: SaleRecord[] = salesRecords): SalesSummary {
  const paidSales = getPaidSales(records);
  const totalSales = paidSales.reduce((sum, sale) => sum + sale.total, 0);
  const estimatedTips = paidSales.reduce((sum, sale) => sum + sale.tip, 0);

  return {
    totalSales,
    averageTicket: paidSales.length > 0 ? totalSales / paidSales.length : 0,
    paidOrdersCount: paidSales.length,
    estimatedTips
  };
}

export function calculatePaymentMethodTotals(
  records: SaleRecord[] = salesRecords
): PaymentMethodTotal[] {
  const paidSales = getPaidSales(records);
  const totalSales = paidSales.reduce((sum, sale) => sum + sale.total, 0);

  return (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => {
    const methodSales = paidSales.filter((sale) => sale.paymentMethod === method);
    const amount = methodSales.reduce((sum, sale) => sum + sale.total, 0);

    return {
      method,
      label: paymentMethodLabels[method],
      amount,
      percentage: totalSales > 0 ? (amount / totalSales) * 100 : 0,
      ordersCount: methodSales.length
    };
  });
}

export function calculateCashClosingSnapshot(
  records: SaleRecord[] = salesRecords
): CashClosingSnapshot {
  const cashSales = getPaidSales(records)
    .filter((sale) => sale.paymentMethod === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
  const cashOut = cashExpenses.reduce((sum, movement) => sum + movement.amount, 0);

  return {
    openingCash: openingCashAmount,
    cashSales,
    cashExpenses: cashOut,
    expectedCash: openingCashAmount + cashSales - cashOut
  };
}

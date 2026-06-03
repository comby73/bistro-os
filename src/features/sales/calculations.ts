import type { Order } from "@/features/orders/types";
import { cashExpenses, openingCashAmount, salesRecords } from "./mock-data";
import type {
  CashClosingSnapshot,
  CashMovement,
  PaymentMethod,
  PaymentMethodTotal,
  SaleRecord,
  SalesSummary
} from "./types";

// ─── Derivar SaleRecords desde pedidos reales del demo-store ───────────────

const PAYMENT_CYCLE: PaymentMethod[] = ["card", "cash", "transfer", "wallet"];
const TIP_RATE = 0.12; // 12% estimado por pedido

function deterministicMethod(orderId: string): PaymentMethod {
  const hash = orderId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PAYMENT_CYCLE[hash % PAYMENT_CYCLE.length];
}

function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
}

/**
 * Convierte los pedidos del demo-store en SaleRecords para el módulo de ventas.
 * - status "delivered" → paymentStatus "paid"
 * - resto (received, preparing, ready) → paymentStatus "pending"
 * - método de pago determinístico por order.id (consistente entre renders)
 * - tip estimado al 12%
 */
export function buildSalesFromOrders(orders: Order[]): SaleRecord[] {
  return orders
    .filter((o) => o.status !== "cancelled")
    .map((order): SaleRecord => {
      const total = orderTotal(order);
      const tip = Math.round(total * TIP_RATE * 10) / 10;
      const isPaid = order.status === "delivered";
      return {
        id: `SAL-${order.id}`,
        orderId: order.id,
        tableLabel: order.table,
        total,
        tip,
        paymentMethod: deterministicMethod(order.id),
        paymentStatus: isPaid ? "paid" : "pending",
        cashier: order.waiter_name,
        paidAt: isPaid
          ? new Date(order.created_at).toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
      };
    });
}

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
  records: SaleRecord[] = salesRecords,
  openingCash: number = openingCashAmount,
  expenses: CashMovement[] = cashExpenses
): CashClosingSnapshot {
  const cashSales = getPaidSales(records)
    .filter((sale) => sale.paymentMethod === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
  const cashOut = expenses.reduce((sum, movement) => sum + movement.amount, 0);

  return {
    openingCash,
    cashSales,
    cashExpenses: cashOut,
    expectedCash: openingCash + cashSales - cashOut,
  };
}

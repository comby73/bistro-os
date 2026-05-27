export type PaymentMethod = "cash" | "card" | "transfer" | "wallet";

export type PaymentStatus = "paid" | "pending";

export interface SaleRecord {
  id: string;
  orderId: string;
  tableLabel: string;
  total: number;
  tip: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashier: string;
  paidAt: string | null;
}

export interface CashMovement {
  label: string;
  amount: number;
}

export interface SalesSummary {
  totalSales: number;
  averageTicket: number;
  paidOrdersCount: number;
  estimatedTips: number;
}

export interface PaymentMethodTotal {
  method: PaymentMethod;
  label: string;
  amount: number;
  percentage: number;
  ordersCount: number;
}

export interface CashClosingSnapshot {
  openingCash: number;
  cashSales: number;
  cashExpenses: number;
  expectedCash: number;
}

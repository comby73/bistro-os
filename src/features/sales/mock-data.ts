import type { CashMovement, SaleRecord } from "./types";

export const salesRecords: SaleRecord[] = [
  {
    id: "SAL-3201",
    orderId: "ORD-1038",
    tableLabel: "Mesa 4",
    total: 118,
    tip: 16,
    paymentMethod: "card",
    paymentStatus: "paid",
    cashier: "Lucía",
    paidAt: "19:12"
  },
  {
    id: "SAL-3202",
    orderId: "ORD-1039",
    tableLabel: "Mesa 2",
    total: 76,
    tip: 10,
    paymentMethod: "cash",
    paymentStatus: "paid",
    cashier: "Matías",
    paidAt: "19:26"
  },
  {
    id: "SAL-3203",
    orderId: "ORD-1040",
    tableLabel: "Barra",
    total: 42,
    tip: 6,
    paymentMethod: "wallet",
    paymentStatus: "paid",
    cashier: "Lucía",
    paidAt: "20:01"
  },
  {
    id: "SAL-3204",
    orderId: "ORD-1041",
    tableLabel: "Mesa 3",
    total: 96,
    tip: 12,
    paymentMethod: "transfer",
    paymentStatus: "paid",
    cashier: "Sofía",
    paidAt: "20:08"
  },
  {
    id: "SAL-3205",
    orderId: "ORD-1042",
    tableLabel: "Mesa 7",
    total: 184,
    tip: 24,
    paymentMethod: "card",
    paymentStatus: "pending",
    cashier: "Sofía",
    paidAt: null
  },
  {
    id: "SAL-3206",
    orderId: "ORD-1043",
    tableLabel: "Mesa 11",
    total: 158,
    tip: 20,
    paymentMethod: "cash",
    paymentStatus: "pending",
    cashier: "Matías",
    paidAt: null
  }
];

export const cashExpenses: CashMovement[] = [
  { label: "Reposición de caja chica", amount: 40 },
  { label: "Compra urgente de hielo", amount: 18 }
];

export const openingCashAmount = 250;

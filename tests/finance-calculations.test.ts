import { describe, expect, it } from "vitest";
import {
  getExpenseTotalsByCategory,
  getFinanceSummary,
  getLowStockSupplies,
  getPaymentBreakdown,
  getProductMargins,
  getSalesByDay
} from "../src/features/finance/calculations";
import type { Expense, FinanceSale, ProductCost, SupplyItem } from "../src/features/finance/types";

const sales: FinanceSale[] = [
  { id: "s1", date: "2026-05-29", time: "20:00", table: "Mesa 1", items: 2, total: 100, tip: 10, paymentMethod: "cash", cashier: "Ana" },
  { id: "s2", date: "2026-05-29", time: "21:00", table: "Mesa 2", items: 3, total: 80, tip: 8, paymentMethod: "card", cashier: "Ana" },
  { id: "s3", date: "2026-05-30", time: "22:00", table: "Barra", items: 1, total: 20, tip: 2, paymentMethod: "cash", cashier: "Luis" }
];

const expenses: Expense[] = [
  { id: "e1", date: "2026-05-01", category: "alquiler", concept: "Local", amount: 300 },
  { id: "e2", date: "2026-05-02", category: "servicios", concept: "Luz", amount: 120 },
  { id: "e3", date: "2026-05-03", category: "servicios", concept: "Gas", amount: 80 }
];

describe("finance calculations", () => {
  it("resume ventas, gastos, sueldos y resultado estimado", () => {
    expect(getFinanceSummary(sales, expenses, 500)).toMatchObject({
      revenue: 200,
      tips: 20,
      salesCount: 3,
      averageTicket: 67,
      expenses: 500,
      payroll: 500,
      netEstimate: -800
    });
  });

  it("agrupa ventas por día y medios de pago", () => {
    expect(getSalesByDay(sales)).toEqual([
      { label: "05-29", revenue: 180 },
      { label: "05-30", revenue: 20 }
    ]);

    const payments = getPaymentBreakdown(sales);
    expect(payments.find((payment) => payment.method === "cash")).toMatchObject({
      amount: 120,
      count: 2,
      percentage: 60
    });
  });

  it("calcula márgenes de productos y faltantes de insumos", () => {
    const products: ProductCost[] = [
      { itemId: "a", name: "Risotto", category: "Principales", price: 30, cost: 12, soldUnits: 10 },
      { itemId: "b", name: "Agua", category: "Bebidas", price: 5, cost: 2, soldUnits: 20 }
    ];
    expect(getProductMargins(products)[0]).toMatchObject({
      itemId: "a",
      margin: 18,
      marginRate: 60,
      grossProfit: 180
    });

    const supplies: SupplyItem[] = [
      { id: "sup-1", name: "Manteles", category: "salon", stock: 4, min: 10, unit: "u" },
      { id: "sup-2", name: "Aceite", category: "cocina", stock: 12, min: 8, unit: "L" }
    ];
    expect(getLowStockSupplies(supplies).map((supply) => supply.name)).toEqual(["Manteles"]);
  });

  it("agrupa gastos por categoría", () => {
    expect(getExpenseTotalsByCategory(expenses)).toEqual([
      { category: "alquiler", amount: 300 },
      { category: "servicios", amount: 200 }
    ]);
  });
});

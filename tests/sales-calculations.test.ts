import { describe, expect, it } from "vitest";
import {
  calculateCashClosingSnapshot,
  calculatePaymentMethodTotals,
  calculateSalesSummary,
  getPendingSales
} from "../src/features/sales/calculations";

describe("sales calculations", () => {
  it("resume ventas cobradas y propinas", () => {
    expect(calculateSalesSummary()).toEqual({
      totalSales: 332,
      averageTicket: 83,
      paidOrdersCount: 4,
      estimatedTips: 44
    });
  });

  it("detecta ventas pendientes y totaliza medios de pago", () => {
    expect(getPendingSales()).toHaveLength(2);
    expect(calculatePaymentMethodTotals().map((item) => item.amount)).toEqual([
      76,
      118,
      96,
      42
    ]);
  });

  it("calcula el cierre esperado de caja", () => {
    expect(calculateCashClosingSnapshot()).toEqual({
      openingCash: 250,
      cashSales: 76,
      cashExpenses: 58,
      expectedCash: 268
    });
  });
});

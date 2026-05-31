import { PAYMENT_LABELS, type Expense, type FinanceSale, type PaymentMethod, type ProductCost, type SupplyItem } from "./types";

export interface FinanceSummary {
  revenue: number;
  tips: number;
  salesCount: number;
  averageTicket: number;
  expenses: number;
  payroll: number;
  netEstimate: number;
}

export interface ChartPoint {
  label: string;
  revenue: number;
  expenses?: number;
}

export interface PaymentBreakdownItem {
  method: PaymentMethod;
  label: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ProductMarginRow extends ProductCost {
  margin: number;
  marginRate: number;
  grossProfit: number;
}

export interface ExpenseCategoryTotal {
  category: string;
  amount: number;
}

export function getFinanceSummary(
  sales: FinanceSale[],
  expenses: Expense[],
  payroll: number
): FinanceSummary {
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const tips = sales.reduce((sum, sale) => sum + sale.tip, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const salesCount = sales.length;

  return {
    revenue,
    tips,
    salesCount,
    averageTicket: salesCount > 0 ? Math.round(revenue / salesCount) : 0,
    expenses: expenseTotal,
    payroll,
    netEstimate: revenue - expenseTotal - payroll
  };
}

export function getSalesByDay(sales: FinanceSale[]): ChartPoint[] {
  const byDay = new Map<string, number>();
  for (const sale of sales) {
    byDay.set(sale.date, (byDay.get(sale.date) ?? 0) + sale.total);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({
      label: date.slice(5),
      revenue
    }));
}

export function getPaymentBreakdown(sales: FinanceSale[]): PaymentBreakdownItem[] {
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => {
    const methodSales = sales.filter((sale) => sale.paymentMethod === method);
    const amount = methodSales.reduce((sum, sale) => sum + sale.total, 0);

    return {
      method,
      label: PAYMENT_LABELS[method],
      amount,
      count: methodSales.length,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    };
  });
}

export function getProductMargins(products: ProductCost[]): ProductMarginRow[] {
  return products
    .map((product) => {
      const margin = product.price - product.cost;
      return {
        ...product,
        margin,
        marginRate: product.price > 0 ? Math.round((margin / product.price) * 100) : 0,
        grossProfit: Math.round(margin * product.soldUnits)
      };
    })
    .sort((a, b) => b.grossProfit - a.grossProfit);
}

export function getLowStockSupplies(supplies: SupplyItem[]): SupplyItem[] {
  return supplies
    .filter((supply) => supply.stock < supply.min)
    .sort((a, b) => a.stock / a.min - b.stock / b.min);
}

export function getExpenseTotalsByCategory(expenses: Expense[]): ExpenseCategoryTotal[] {
  const byCategory = new Map<string, number>();
  for (const expense of expenses) {
    byCategory.set(expense.category, (byCategory.get(expense.category) ?? 0) + expense.amount);
  }

  return [...byCategory.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

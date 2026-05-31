export type PaymentMethod = "cash" | "card" | "transfer" | "wallet";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  wallet: "Billetera"
};

export interface FinanceSale {
  id: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
  table: string;
  items: number;       // cantidad de productos
  total: number;       // valor base demo, se muestra convertido a ARS
  tip: number;         // propina
  paymentMethod: PaymentMethod;
  cashier: string;
}

export interface ProductCost {
  itemId: string;
  name: string;
  category: string;
  price: number;       // precio de venta
  cost: number;        // costo de insumos
  soldUnits: number;   // unidades vendidas en el período
}

export type SupplyCategory = "salon" | "cocina" | "limpieza" | "descartables" | "mantenimiento";

export interface SupplyItem {
  id: string;
  name: string;
  category: SupplyCategory;
  stock: number;
  min: number;         // umbral mínimo; si stock < min → faltante
  unit: string;        // "u", "kg", "L", "rollo"
}

export type TableStatus = "libre" | "ocupada" | "reservada" | "fuera_servicio";

export interface RestaurantTableRow {
  id: string;
  label: string;
  area: string;        // "Salón", "Terraza", "Barra"
  capacity: number;
  status: TableStatus;
}

export type ExpenseCategory =
  | "alquiler"
  | "servicios"
  | "limpieza"
  | "salon"
  | "cocina"
  | "insumos"
  | "sueldos"
  | "mantenimiento"
  | "administracion"
  | "otros";

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  concept: string;
  amount: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;        // "Cocinero", "Mozo", "Encargado"
  monthlySalary: number;
  status: "activo" | "licencia";
}

export interface FinanceData {
  sales: FinanceSale[];
  productCosts: ProductCost[];
  supplies: SupplyItem[];
  tables: RestaurantTableRow[];
  expenses: Expense[];
  employees: Employee[];
}

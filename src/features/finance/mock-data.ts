import catalog from "@/features/menu/catalog.json";
import type {
  Employee,
  Expense,
  FinanceData,
  FinanceSale,
  PaymentMethod,
  ProductCost,
  RestaurantTableRow,
  SupplyItem
} from "./types";

// PRNG determinista por restaurante (mismo restaurante → mismos datos)
function makeRng(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  "cat-entradas": "Entradas",
  "cat-principales": "Principales",
  "cat-minutas": "Minutas",
  "cat-parrilla": "Parrilla",
  "cat-bebidas": "Bebidas",
  "cat-postres": "Postres"
};

const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card", "transfer", "wallet"];
const CASHIERS = ["Lucía", "Matías", "Sofía", "Pablo", "Daniela"];
const AREAS = ["Salón", "Terraza", "Barra"];

function dayString(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Ventas: últimos 7 días ────────────────────────────────────────────────────
function buildSales(rng: () => number): FinanceSale[] {
  const sales: FinanceSale[] = [];
  let seq = 3200;
  for (let d = 6; d >= 0; d--) {
    const perDay = 6 + Math.floor(rng() * 8); // 6-13 ventas/día
    for (let i = 0; i < perDay; i++) {
      const total = 25 + Math.floor(rng() * 90);
      sales.push({
        id: `SAL-${seq++}`,
        date: dayString(d),
        time: `${12 + Math.floor(rng() * 11)}`.padStart(2, "0") + ":" + `${Math.floor(rng() * 60)}`.padStart(2, "0"),
        table: rng() > 0.15 ? `Mesa ${1 + Math.floor(rng() * 12)}` : "Barra",
        items: 1 + Math.floor(rng() * 6),
        total,
        tip: Math.round(total * (0.05 + rng() * 0.1)),
        paymentMethod: pick(rng, PAYMENT_METHODS),
        cashier: pick(rng, CASHIERS)
      });
    }
  }
  return sales;
}

// ── Costos de productos (desde el catálogo del restaurante) ────────────────────
function buildProductCosts(rng: () => number, restaurantId: string): ProductCost[] {
  return catalog.items
    .filter((it) => it.restaurant_id === restaurantId)
    .map((it) => {
      const costRatio = 0.28 + rng() * 0.18; // costo = 28%-46% del precio
      return {
        itemId: it.id,
        name: it.name,
        category: CATEGORY_LABELS[it.category_id] ?? it.category_id,
        price: it.price,
        cost: Math.round(it.price * costRatio * 100) / 100,
        soldUnits: 5 + Math.floor(rng() * 60)
      };
    });
}

// ── Insumos / inventario (con faltantes) ───────────────────────────────────────
function buildSupplies(rng: () => number): SupplyItem[] {
  const base: Omit<SupplyItem, "stock">[] = [
    { id: "sup-1", name: "Manteles de tela", category: "salon", min: 20, unit: "u" },
    { id: "sup-2", name: "Servilletas de papel", category: "descartables", min: 10, unit: "paq" },
    { id: "sup-3", name: "Detergente", category: "limpieza", min: 8, unit: "L" },
    { id: "sup-4", name: "Papel de cocina", category: "cocina", min: 12, unit: "rollo" },
    { id: "sup-5", name: "Aceite de girasol", category: "cocina", min: 15, unit: "L" },
    { id: "sup-6", name: "Bolsas de residuo", category: "limpieza", min: 5, unit: "paq" },
    { id: "sup-7", name: "Vasos descartables", category: "descartables", min: 10, unit: "paq" },
    { id: "sup-8", name: "Sal fina", category: "cocina", min: 6, unit: "kg" },
    { id: "sup-9", name: "Posavasos", category: "salon", min: 30, unit: "u" }
  ];
  return base.map((b) => ({
    ...b,
    // ~1/3 quedan por debajo del mínimo (faltante)
    stock: rng() < 0.33 ? Math.floor(b.min * rng() * 0.8) : b.min + Math.floor(rng() * b.min)
  }));
}

// ── Mesas ──────────────────────────────────────────────────────────────────────
function buildTables(rng: () => number): RestaurantTableRow[] {
  const statuses = ["libre", "ocupada", "reservada", "fuera_servicio"] as const;
  return Array.from({ length: 12 }, (_, i) => ({
    id: `tbl-${i + 1}`,
    label: `Mesa ${i + 1}`,
    area: AREAS[i % AREAS.length],
    capacity: [2, 2, 4, 4, 6][Math.floor(rng() * 5)],
    status: rng() < 0.05 ? "fuera_servicio" : pick(rng, [...statuses.slice(0, 3)])
  }));
}

// ── Gastos del mes ──────────────────────────────────────────────────────────────
function buildExpenses(rng: () => number): Expense[] {
  const month = new Date().toISOString().slice(0, 7);
  const items: Omit<Expense, "id">[] = [
    { date: `${month}-01`, category: "alquiler", concept: "Alquiler del local", amount: 2800 },
    { date: `${month}-03`, category: "servicios", concept: "Electricidad", amount: 420 + Math.floor(rng() * 200) },
    { date: `${month}-03`, category: "servicios", concept: "Gas", amount: 180 + Math.floor(rng() * 120) },
    { date: `${month}-04`, category: "servicios", concept: "Agua", amount: 90 },
    { date: `${month}-05`, category: "servicios", concept: "Internet y teléfono", amount: 75 },
    { date: `${month}-06`, category: "limpieza", concept: "Limpieza de mantelería", amount: 130 + Math.floor(rng() * 70) },
    { date: `${month}-08`, category: "insumos", concept: "Compra de mercadería", amount: 1900 + Math.floor(rng() * 800) },
    { date: `${month}-12`, category: "mantenimiento", concept: "Service heladera", amount: 240 },
    { date: `${month}-13`, category: "mantenimiento", concept: "Service lavavajillas", amount: 180 + Math.floor(rng() * 120) },
    { date: `${month}-15`, category: "insumos", concept: "Bebidas y vinos", amount: 1100 + Math.floor(rng() * 500) },
    { date: `${month}-20`, category: "administracion", concept: "Publicidad redes", amount: 150 }
  ];
  return items.map((e, i) => ({ ...e, id: `exp-${i + 1}` }));
}

// ── Empleados / nómina ───────────────────────────────────────────────────────────
function buildEmployees(rng: () => number): Employee[] {
  const roster: Omit<Employee, "id" | "monthlySalary" | "status">[] = [
    { name: "Carlos Díaz", role: "Cocinero" },
    { name: "Sofía Torres", role: "Moza" },
    { name: "Martín López", role: "Encargado" },
    { name: "Lucía Romero", role: "Cajera" },
    { name: "Pablo Sánchez", role: "Bachero" },
    { name: "Daniela Ruiz", role: "Moza" }
  ];
  const salaryByRole: Record<string, number> = {
    Encargado: 2200, Cocinero: 1800, Cajera: 1500, Moza: 1300, Bachero: 1200
  };
  return roster.map((e, i) => ({
    ...e,
    id: `emp-${i + 1}`,
    monthlySalary: (salaryByRole[e.role] ?? 1300) + Math.floor(rng() * 200),
    status: rng() < 0.12 ? "licencia" : "activo"
  }));
}

// Caché por restaurante (deterministe, no se regenera en cada render)
const cache = new Map<string, FinanceData>();

export function getFinanceData(restaurantId: string): FinanceData {
  const cached = cache.get(restaurantId);
  if (cached) return cached;

  const rng = makeRng(restaurantId);
  const data: FinanceData = {
    sales: buildSales(rng),
    productCosts: buildProductCosts(rng, restaurantId),
    supplies: buildSupplies(rng),
    tables: buildTables(rng),
    expenses: buildExpenses(rng),
    employees: buildEmployees(rng)
  };
  cache.set(restaurantId, data);
  return data;
}

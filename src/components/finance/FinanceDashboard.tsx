"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Banknote,
  Download,
  FileSpreadsheet,
  PackageCheck,
  ReceiptText,
  Table2,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  getExpenseTotalsByCategory,
  getFinanceSummary,
  getLowStockSupplies,
  getPaymentBreakdown,
  getProductMargins,
  getSalesByDay
} from "@/features/finance/calculations";
import { PAYMENT_LABELS, type FinanceData } from "@/features/finance/types";
import type { ExpenseCategory, PaymentMethod, SupplyCategory } from "@/features/finance/types";
import { arsToUsd, formatArsFromUsd, usdToArs } from "@/lib/utils";

export interface FinanceRestaurantView {
  id: string;
  name: string;
  color: string;
  branchNames: string[];
  finance: FinanceData;
}

const COLORS = ["#E8B863", "#4A9B7F", "#C0732A", "#8FB8DE", "#D98282", "#A889E6"];
const STORAGE_PREFIX = "bistro-finance-demo";

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "servicios", label: "Servicios" },
  { value: "limpieza", label: "Limpieza" },
  { value: "salon", label: "Salón" },
  { value: "cocina", label: "Cocina" },
  { value: "insumos", label: "Mercadería/insumos" },
  { value: "mantenimiento", label: "Equipamiento" },
  { value: "sueldos", label: "Sueldos" },
  { value: "administracion", label: "Administración" },
  { value: "alquiler", label: "Alquiler" },
  { value: "otros", label: "Otros" }
];

const SUPPLY_CATEGORIES: { value: SupplyCategory; label: string }[] = [
  { value: "salon", label: "Salón" },
  { value: "cocina", label: "Cocina" },
  { value: "limpieza", label: "Limpieza" },
  { value: "descartables", label: "Descartables" },
  { value: "mantenimiento", label: "Mantenimiento" }
];

function money(value: number) {
  return formatArsFromUsd(value);
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    libre: "Libre",
    ocupada: "Ocupada",
    reservada: "Reservada",
    fuera_servicio: "Fuera de servicio"
  };
  return labels[status] ?? status;
}

function exportRows(restaurant: FinanceRestaurantView) {
  const { finance } = restaurant;

  return {
    Ventas: finance.sales.map((sale) => ({
      Fecha: sale.date,
      Hora: sale.time,
      Mesa: sale.table,
      Items: sale.items,
      "Total ARS": usdToArs(sale.total),
      Propina: usdToArs(sale.tip),
      Pago: PAYMENT_LABELS[sale.paymentMethod],
      Cajero: sale.cashier
    })),
    Costos: getProductMargins(finance.productCosts).map((product) => ({
      Producto: product.name,
      Categoria: product.category,
      "Precio ARS": usdToArs(product.price),
      "Costo ARS": usdToArs(product.cost),
      "Margen ARS": usdToArs(product.margin),
      "Margen %": product.marginRate,
      Vendidos: product.soldUnits,
      "Ganancia bruta": product.grossProfit
    })),
    Inventario: finance.supplies.map((supply) => ({
      Insumo: supply.name,
      Categoria: supply.category,
      Stock: supply.stock,
      Minimo: supply.min,
      Unidad: supply.unit,
      Estado: supply.stock < supply.min ? "Faltante" : "OK"
    })),
    Mesas: finance.tables.map((table) => ({
      Mesa: table.label,
      Area: table.area,
      Capacidad: table.capacity,
      Estado: statusLabel(table.status)
    })),
    Gastos: finance.expenses.map((expense) => ({
      Fecha: expense.date,
      Categoria: expense.category,
      Concepto: expense.concept,
      "Monto ARS": usdToArs(expense.amount)
    })),
    Empleados: finance.employees.map((employee) => ({
      Nombre: employee.name,
      Rol: employee.role,
      "Sueldo ARS": usdToArs(employee.monthlySalary),
      Estado: employee.status
    }))
  };
}

export function FinanceDashboard({ restaurants }: { restaurants: FinanceRestaurantView[] }) {
  const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0]?.id ?? "");
  const [financeByRestaurant, setFinanceByRestaurant] = useState<Record<string, FinanceData>>({});
  const [expenseForm, setExpenseForm] = useState({
    category: "limpieza" as ExpenseCategory,
    concept: "Limpieza de mantelería",
    amount: String(usdToArs(85))
  });
  const [stockForm, setStockForm] = useState({
    supplyId: "",
    name: "Lavavajillas",
    category: "mantenimiento" as SupplyCategory,
    stock: "0",
    min: "1",
    unit: "u"
  });
  const [tipForm, setTipForm] = useState({
    saleId: "",
    amount: String(usdToArs(10)),
    method: "cash" as PaymentMethod
  });
  const active = restaurants.find((restaurant) => restaurant.id === activeRestaurantId) ?? restaurants[0];
  const activeFinance = active
    ? (financeByRestaurant[active.id] ?? active.finance)
    : null;

  useEffect(() => {
    const next: Record<string, FinanceData> = {};
    for (const restaurant of restaurants) {
      const stored = window.localStorage.getItem(`${STORAGE_PREFIX}-${restaurant.id}`);
      if (stored) {
        try {
          next[restaurant.id] = JSON.parse(stored) as FinanceData;
        } catch {
          window.localStorage.removeItem(`${STORAGE_PREFIX}-${restaurant.id}`);
        }
      }
    }
    window.setTimeout(() => setFinanceByRestaurant(next), 0);
  }, [restaurants]);

  useEffect(() => {
    if (!activeFinance || activeFinance.supplies.length === 0 || stockForm.supplyId) return;
    const firstSupply = activeFinance.supplies[0];
    window.setTimeout(() => {
      setStockForm((current) => ({
        ...current,
        supplyId: firstSupply.id,
        name: firstSupply.name,
        category: firstSupply.category,
        stock: String(firstSupply.stock),
        min: String(firstSupply.min),
        unit: firstSupply.unit
      }));
    }, 0);
  }, [activeFinance, stockForm.supplyId]);

  useEffect(() => {
    if (!activeFinance || activeFinance.sales.length === 0 || tipForm.saleId) return;
    window.setTimeout(() => {
      setTipForm((current) => ({ ...current, saleId: activeFinance.sales[0].id }));
    }, 0);
  }, [activeFinance, tipForm.saleId]);

  function persistFinance(restaurantId: string, finance: FinanceData) {
    window.localStorage.setItem(`${STORAGE_PREFIX}-${restaurantId}`, JSON.stringify(finance));
    setFinanceByRestaurant((current) => ({ ...current, [restaurantId]: finance }));
  }

  const derived = useMemo(() => {
    if (!activeFinance) return null;
    const payroll = activeFinance.employees.reduce((sum, employee) => sum + employee.monthlySalary, 0);
    return {
      summary: getFinanceSummary(activeFinance.sales, activeFinance.expenses, payroll),
      salesByDay: getSalesByDay(activeFinance.sales),
      payments: getPaymentBreakdown(activeFinance.sales),
      products: getProductMargins(activeFinance.productCosts),
      lowStock: getLowStockSupplies(activeFinance.supplies),
      expenses: getExpenseTotalsByCategory(activeFinance.expenses)
    };
  }, [activeFinance]);

  async function handleExport() {
    if (!active) return;
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const sheets = exportRows({ ...active, finance: activeFinance ?? active.finance });

    Object.entries(sheets).forEach(([name, rows]) => {
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name);
    });

    XLSX.writeFile(workbook, `finanzas-${active.name.toLowerCase().replace(/\s+/g, "-")}.xlsx`);
  }

  function handleAddExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !activeFinance) return;
    const amountArs = Number(expenseForm.amount);
    if (!expenseForm.concept.trim() || !Number.isFinite(amountArs) || amountArs <= 0) return;

    persistFinance(active.id, {
      ...activeFinance,
      expenses: [
        {
          id: `exp-local-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          category: expenseForm.category,
          concept: expenseForm.concept.trim(),
          amount: arsToUsd(amountArs)
        },
        ...activeFinance.expenses
      ]
    });
    setExpenseForm((current) => ({ ...current, concept: "", amount: "" }));
  }

  function handleSaveStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !activeFinance) return;
    const stock = Number(stockForm.stock);
    const min = Number(stockForm.min);
    if (!Number.isFinite(stock) || !Number.isFinite(min) || min < 0) return;

    const selectedSupplyId = stockForm.supplyId || activeFinance.supplies[0]?.id || "";
    const existing = activeFinance.supplies.find((supply) => supply.id === selectedSupplyId);
    const nextSupply = existing
      ? activeFinance.supplies.map((supply) =>
          supply.id === selectedSupplyId ? { ...supply, stock, min, unit: stockForm.unit } : supply
        )
      : [
          {
            id: `sup-local-${Date.now()}`,
            name: stockForm.name.trim() || "Insumo",
            category: stockForm.category,
            stock,
            min,
            unit: stockForm.unit || "u"
          },
          ...activeFinance.supplies
        ];

    persistFinance(active.id, { ...activeFinance, supplies: nextSupply });
  }

  function handleAddTip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !activeFinance) return;
    const amountArs = Number(tipForm.amount);
    const selectedSaleId = tipForm.saleId || activeFinance.sales[0]?.id || "";
    if (!selectedSaleId || !Number.isFinite(amountArs) || amountArs <= 0) return;

    persistFinance(active.id, {
      ...activeFinance,
      sales: activeFinance.sales.map((sale) =>
        sale.id === selectedSaleId
          ? { ...sale, tip: sale.tip + arsToUsd(amountArs), paymentMethod: tipForm.method }
          : sale
      )
    });
    setTipForm((current) => ({ ...current, amount: "" }));
  }

  if (!active || !activeFinance || !derived) {
    return (
      <section className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-paper/50">
        No hay restaurantes asignados para mostrar finanzas.
      </section>
    );
  }

  const tableStatusCounts = activeFinance.tables.reduce<Record<string, number>>((acc, table) => {
    acc[table.status] = (acc[table.status] ?? 0) + 1;
    return acc;
  }, {});
  const selectedSupplyId = stockForm.supplyId || activeFinance.supplies[0]?.id || "";
  const selectedSaleId = tipForm.saleId || activeFinance.sales[0]?.id || "";

  return (
    <section className="mx-auto max-w-[1480px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Análisis financiero</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Panel financiero operativo.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-paper/58">
            Ventas, medios de pago, costos, gastos, nómina, mesas e inventario para análisis del dueño.
          </p>
        </div>

      {/* Banner: datos demo para presentación */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm">
        <AlertTriangle size={15} className="shrink-0 text-amber-400" />
        <span className="text-amber-300/90">
          <span className="font-semibold">Datos demo para presentación.</span>{" "}
          Las métricas financieras son generadas deterministicamente por restaurante.
          Se conectarán a datos reales cuando{" "}
          <span className="font-medium">pedidos, caja y pagos</span> estén persistidos en Supabase (Fase 4D/4G).
        </span>
      </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-11 rounded-2xl border border-line bg-layer1 px-4 text-sm text-paper outline-none"
            value={active.id}
            onChange={(event) => setActiveRestaurantId(event.target.value)}
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 text-sm font-semibold text-gold transition hover:bg-gold/15"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Ventas", value: money(derived.summary.revenue), icon: Banknote },
          { label: "Ticket promedio", value: money(derived.summary.averageTicket), icon: ReceiptText },
          { label: "Gastos", value: money(derived.summary.expenses), icon: FileSpreadsheet },
          { label: "Sueldos", value: money(derived.summary.payroll), icon: Users },
          { label: "Resultado estimado", value: money(derived.summary.netEstimate), icon: TrendingIcon }
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-line bg-layer1/60 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.16em] text-paper/45">{metric.label}</p>
              <metric.icon size={17} className="text-gold" />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-paper">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <form onSubmit={handleAddExpense} className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Carga rápida</p>
          <h2 className="text-lg font-semibold">Nuevo gasto</h2>
          <div className="mt-4 grid gap-3">
            <select
              className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
              value={expenseForm.category}
              onChange={(event) =>
                setExpenseForm((current) => ({ ...current, category: event.target.value as ExpenseCategory }))
              }
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <input
              className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
              value={expenseForm.concept}
              onChange={(event) => setExpenseForm((current) => ({ ...current, concept: event.target.value }))}
              placeholder="Limpieza de mantelería"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_112px]">
              <input
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={expenseForm.amount}
                onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
                type="number"
                min="1"
                placeholder="Monto en pesos"
              />
              <button type="submit" className="btn-gold h-11 rounded-xl px-4 py-0">
                Agregar
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleSaveStock} className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Inventario</p>
          <h2 className="text-lg font-semibold">Actualizar stock</h2>
          <div className="mt-4 grid gap-3">
            <select
              className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
              value={selectedSupplyId}
              onChange={(event) => {
                const supply = activeFinance.supplies.find((item) => item.id === event.target.value);
                setStockForm((current) => ({
                  ...current,
                  supplyId: event.target.value,
                  name: supply?.name ?? current.name,
                  category: supply?.category ?? current.category,
                  stock: String(supply?.stock ?? current.stock),
                  min: String(supply?.min ?? current.min),
                  unit: supply?.unit ?? current.unit
                }));
              }}
            >
              {activeFinance.supplies.map((supply) => (
                <option key={supply.id} value={supply.id}>
                  {supply.name}
                </option>
              ))}
              <option value="">Nuevo insumo</option>
            </select>
            {!stockForm.supplyId && (
              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                <input
                  className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                  value={stockForm.name}
                  onChange={(event) => setStockForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Lavavajillas"
                />
                <select
                  className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                  value={stockForm.category}
                  onChange={(event) =>
                    setStockForm((current) => ({ ...current, category: event.target.value as SupplyCategory }))
                  }
                >
                  {SUPPLY_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_88px]">
              <input
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={stockForm.stock}
                onChange={(event) => setStockForm((current) => ({ ...current, stock: event.target.value }))}
                type="number"
                min="0"
                placeholder="Stock"
              />
              <input
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={stockForm.min}
                onChange={(event) => setStockForm((current) => ({ ...current, min: event.target.value }))}
                type="number"
                min="0"
                placeholder="Mín."
              />
              <input
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={stockForm.unit}
                onChange={(event) => setStockForm((current) => ({ ...current, unit: event.target.value }))}
                placeholder="u"
              />
            </div>
            <button type="submit" className="btn-gold h-11 w-full rounded-xl px-4 py-0 sm:w-auto">
              Guardar stock
            </button>
          </div>
        </form>

        <form onSubmit={handleAddTip} className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Caja</p>
          <h2 className="text-lg font-semibold">Registrar propina</h2>
          <div className="mt-4 grid gap-3">
            <select
              className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
              value={selectedSaleId}
              onChange={(event) => setTipForm((current) => ({ ...current, saleId: event.target.value }))}
            >
              {activeFinance.sales.slice(0, 20).map((sale) => (
                <option key={sale.id} value={sale.id}>
                  {sale.table} · {sale.date} {sale.time} · {money(sale.total)}
                </option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
              <input
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={tipForm.amount}
                onChange={(event) => setTipForm((current) => ({ ...current, amount: event.target.value }))}
                type="number"
                min="1"
                placeholder="Propina en pesos"
              />
              <select
                className="h-11 rounded-xl border border-line bg-ink/50 px-3 text-sm text-paper outline-none"
                value={tipForm.method}
                onChange={(event) => setTipForm((current) => ({ ...current, method: event.target.value as PaymentMethod }))}
              >
                {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-gold h-11 w-full rounded-xl px-4 py-0 sm:w-auto">
              Sumar propina
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Ventas</p>
              <h2 className="text-xl font-semibold">Evolución últimos 7 días</h2>
            </div>
            <span className="text-xs text-paper/45">{derived.summary.salesCount} ventas</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={derived.salesByDay}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={active.color} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={active.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(246,238,219,0.58)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(246,238,219,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#17130f", border: "1px solid rgba(232,184,99,0.25)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke={active.color} fill="url(#revenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Medios de pago</p>
          <h2 className="text-xl font-semibold">Distribución cobrada</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={derived.payments} dataKey="amount" nameKey="label" innerRadius={54} outerRadius={82} paddingAngle={3}>
                  {derived.payments.map((entry, index) => (
                    <Cell key={entry.method} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#17130f", border: "1px solid rgba(232,184,99,0.25)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {derived.payments.map((payment, index) => (
              <div key={payment.method} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-paper/65">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {payment.label}
                </span>
                <span className="font-semibold text-paper">{money(payment.amount)} · {payment.percentage}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-layer1/45 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">Detalle</p>
            <h2 className="text-xl font-semibold">Tabla de ventas</h2>
          </div>
          <span className="text-xs text-paper/45">Exportable en Excel</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-paper/40">
              <tr>
                <th className="py-3">Fecha</th>
                <th>Mesa</th>
                <th>Items</th>
                <th>Total</th>
                <th>Propina</th>
                <th>Pago</th>
                <th>Cajero</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {activeFinance.sales.slice(0, 12).map((sale) => (
                <tr key={sale.id} className="text-paper/68">
                  <td className="py-3">{sale.date} · {sale.time}</td>
                  <td>{sale.table}</td>
                  <td>{sale.items}</td>
                  <td className="font-semibold text-paper">{money(sale.total)}</td>
                  <td>{money(sale.tip)}</td>
                  <td>{PAYMENT_LABELS[sale.paymentMethod]}</td>
                  <td>{sale.cashier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Costos</p>
          <h2 className="text-xl font-semibold">Rentabilidad por producto</h2>
          <div className="mt-5 space-y-3">
            {derived.products.slice(0, 8).map((product) => (
              <div key={product.itemId} className="rounded-xl border border-line/70 bg-ink/35 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-paper">{product.name}</p>
                    <p className="mt-1 text-xs text-paper/45">{product.category} · {product.soldUnits} vendidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold">{product.marginRate}%</p>
                    <p className="text-xs text-paper/45">{money(product.grossProfit)}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-layer2">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(product.marginRate, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">Inventario</p>
              <h2 className="text-xl font-semibold">Faltantes operativos</h2>
            </div>
            <AlertTriangle size={20} className="text-gold" />
          </div>
          <div className="space-y-3">
            {derived.lowStock.map((supply) => (
              <div key={supply.id} className="flex items-center justify-between gap-4 rounded-xl border border-gold/20 bg-gold/8 p-3">
                <div>
                  <p className="font-semibold text-paper">{supply.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/42">{supply.category}</p>
                </div>
                <p className="text-sm text-gold">{supply.stock}/{supply.min} {supply.unit}</p>
              </div>
            ))}
            {derived.lowStock.length === 0 && (
              <div className="rounded-xl border border-line bg-ink/35 p-4 text-sm text-paper/50">
                No hay faltantes por debajo del mínimo.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Mesas</p>
          <h2 className="text-xl font-semibold">Estado del salón</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Object.entries(tableStatusCounts).map(([status, count]) => (
              <div key={status} className="rounded-xl border border-line/70 bg-ink/35 p-3">
                <Table2 size={17} className="mb-2 text-gold" />
                <p className="text-2xl font-semibold text-paper">{count}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-paper/42">{statusLabel(status)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {activeFinance.tables.map((table) => (
              <div key={table.id} className="flex items-center justify-between rounded-xl border border-line/60 px-3 py-2 text-sm">
                <span>{table.label} · {table.capacity}p</span>
                <span className="text-paper/48">{statusLabel(table.status)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-layer1/45 p-5">
          <p className="eyebrow mb-2">Gastos</p>
          <h2 className="text-xl font-semibold">Gastos + pago de empleados</h2>
          <div className="mt-5 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={derived.expenses}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: "rgba(246,238,219,0.52)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(246,238,219,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#17130f", border: "1px solid rgba(232,184,99,0.25)", borderRadius: 12 }} />
                <Bar dataKey="amount" fill={active.color} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {activeFinance.employees.map((employee) => (
              <div key={employee.id} className="rounded-xl border border-line/70 bg-ink/35 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-paper">{employee.name}</p>
                    <p className="mt-1 text-xs text-paper/45">{employee.role} · {employee.status}</p>
                  </div>
                  <p className="text-sm font-semibold text-gold">{money(employee.monthlySalary)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sección ARCA / Facturación futura */}
      <section className="rounded-3xl border border-line bg-layer1/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">Facturación</p>
            <h3 className="text-xl font-semibold text-paper">Integración ARCA — preparada como futura</h3>
            <p className="mt-3 text-sm leading-7 text-paper/60">
              Bistró OS no emite comprobantes fiscales reales. La arquitectura está preparada
              para conectar con <strong className="text-paper/80">ARCA (ex-AFIP)</strong> cuando
              el restaurante obtenga su certificado digital y clave fiscal.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-paper/58">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-gold">•</span>
                <span>La tabla <code className="text-gold/80">sales_payments</code> ya existe en Supabase para registrar pagos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-gold">•</span>
                <span>El cierre de caja usa <code className="text-gold/80">cash_closings</code> con apertura, cierre y diferencia contada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-gold">•</span>
                <span>La integración ARCA se conectaría como webhook externo o módulo n8n — sin modificar la app interna.</span>
              </li>
            </ul>
          </div>
          <div className="shrink-0 rounded-2xl border border-line bg-layer1/60 px-5 py-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-paper/40">Estado</p>
            <p className="mt-2 font-semibold text-paper/70">Arquitectura lista</p>
            <p className="mt-1 text-sm text-paper/45">Integración pendiente</p>
          </div>
        </div>
      </section>

    </section>
  );
}

function TrendingIcon(props: { size?: number; className?: string }) {
  return <PackageCheck {...props} />;
}

"use client";

import { useMemo, useState } from "react";
import { useDemoMenu } from "@/features/menu/demo-store";
import type { MenuCatalog } from "@/features/menu/types";
import { getOrderTotal } from "@/features/orders/calculations";
import { useDemoOrders } from "@/features/orders/demo-store";
import { syncOrderCreate } from "@/features/orders/order-actions";
import type { Order } from "@/features/orders/types";
import { formatArsFromUsd } from "@/lib/utils";

export function OrderComposer({
  defaultWaiterName,
  initialMenuCatalog,
  restaurantId,
  branchId
}: {
  defaultWaiterName: string;
  initialMenuCatalog?: MenuCatalog;
  restaurantId?: string;
  branchId?: string | null;
}) {
  const { createOrder, orders } = useDemoOrders(restaurantId, branchId);
  const { categories, items: menuItems } = useDemoMenu(initialMenuCatalog, restaurantId);
  const [table, setTable] = useState("");
  const [waiterName, setWaiterName] = useState(defaultWaiterName);
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const selectedProducts = useMemo(
    () =>
      menuItems
        .filter((item) => (quantities[item.id] ?? 0) > 0)
        .map((item) => ({
          ...item,
          quantity: quantities[item.id]
        })),
    [menuItems, quantities]
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory = !activeCategoryId || item.category_id === activeCategoryId;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return item.available && matchesCategory && matchesSearch;
    });
  }, [activeCategoryId, menuItems, search]);

  const draftOrder = useMemo<Order>(
    () => ({
      id: "draft",
      table: table.trim() || "Mesa pendiente",
      status: "received",
      created_at: new Date(0).toISOString(),
      waiter_name: waiterName.trim() || defaultWaiterName,
      notes: notes.trim() || undefined,
      items: selectedProducts.map((item) => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        station: item.station,
        unit_price: item.price
      }))
    }),
    [defaultWaiterName, notes, selectedProducts, table, waiterName]
  );

  const totalItems = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  const currentOrderTotal = draftOrder.items.length > 0 ? getOrderTotal(draftOrder) : 0;
  const activeOrdersCount = orders.filter(
    (order) => order.status === "received" || order.status === "preparing"
  ).length;

  function updateQuantity(itemId: string, delta: number) {
    setQuantities((current) => {
      const nextValue = Math.max(0, (current[itemId] ?? 0) + delta);
      return { ...current, [itemId]: nextValue };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!table.trim()) {
      setError("Indicá la mesa.");
      return;
    }

    if (!waiterName.trim()) {
      setError("Indicá el mozo.");
      return;
    }

    if (draftOrder.items.length === 0) {
      setError("Agregá al menos un producto.");
      return;
    }

    const createdOrder = createOrder({
      table,
      waiter_name: waiterName,
      notes,
      items: draftOrder.items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity
      }))
    });

    // Sync a Supabase en background (fire-and-forget).
    // syncOrderCreate() ahora devuelve el UUID de Supabase — lo ignoramos aquí
    // porque la búsqueda por metadata.local_id alcanza para el sync de status.
    if (createdOrder && restaurantId) {
      syncOrderCreate(createdOrder, restaurantId, branchId ?? null).catch(() => {});
    }

    setTable("");
    setNotes("");
    setQuantities({});
    setSearch("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/50">Mesa</span>
              <input
                className="w-full rounded-2xl border border-line bg-layer1/70 px-4 py-4 text-base outline-none transition focus:border-gold/70"
                value={table}
                onChange={(event) => setTable(event.target.value)}
                placeholder="Mesa 14"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/50">Mozo</span>
              <input
                className="w-full rounded-2xl border border-line bg-layer1/70 px-4 py-4 text-base outline-none transition focus:border-gold/70"
                value={waiterName}
                onChange={(event) => setWaiterName(event.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={
                  activeCategoryId === category.id
                    ? "rounded-full border border-gold/40 bg-gold/12 px-4 py-2 text-sm text-gold"
                    : "rounded-full border border-line bg-layer1/60 px-4 py-2 text-sm text-paper/65 transition hover:border-gold/30 hover:text-paper"
                }
              >
                {category.name}
              </button>
            ))}
            <input
              className="min-w-56 flex-1 rounded-full border border-line bg-layer1/60 px-4 py-2.5 text-sm outline-none transition focus:border-gold/50"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-line bg-layer1/55 p-4 transition hover:border-gold/25 hover:bg-layer1/80"
              >
                <div className="flex h-full flex-col justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.03em]">{item.name}</p>
                    <p className="mt-2 text-sm leading-6 text-paper/55">{item.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Precio</p>
                      <p className="mt-1 text-xl font-semibold text-gold">{formatArsFromUsd(item.price)}</p>
                    </div>

                    {/* Controles +/− a ancho completo — nunca se pisan con el precio */}
                    <div className="flex items-center justify-between gap-2 rounded-full border border-line bg-ink px-3 py-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-lg text-paper/70 transition hover:border-gold/35 hover:text-paper"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-base font-semibold">
                        {quantities[item.id] ?? 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-gold/12 text-lg text-gold transition hover:border-gold/45"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {visibleProducts.length === 0 && (
              <div className="rounded-3xl border border-dashed border-line p-6 text-sm text-paper/42">
                No hay productos para ese filtro.
              </div>
            )}
          </div>
        </section>

        <aside className="xl:sticky xl:top-8 xl:self-start">
          <section className="card-premium p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Pedido actual</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  {table.trim() || "Mesa pendiente"}
                </h3>
              </div>
              <div className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Activos</p>
                <p className="mt-1 text-2xl font-semibold text-gold">{activeOrdersCount}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-line bg-layer1/60 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-paper/55">
                          {item.quantity} x {formatArsFromUsd(item.price)}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gold">
                        {formatArsFromUsd(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-line p-5 text-sm text-paper/42">
                  Seleccioná productos para armar el pedido.
                </div>
              )}
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/42">Notas</span>
              <textarea
                className="min-h-24 w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/70"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Alergias o timing"
              />
            </label>

            <div className="mt-5 rounded-2xl border border-line bg-ink px-4 py-4">
              <div className="flex items-center justify-between text-sm text-paper/55">
                <span>Total actual</span>
                <span>{totalItems} items</span>
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-gold">
                {formatArsFromUsd(currentOrderTotal)}
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button type="submit" className="btn-gold mt-5 w-full py-4 text-sm">
              Enviar a cocina
            </button>
          </section>
        </aside>
      </div>
    </form>
  );
}

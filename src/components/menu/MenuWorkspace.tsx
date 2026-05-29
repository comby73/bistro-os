"use client";

import { useMemo, useState, useTransition } from "react";
import type { RoleId } from "@/features/auth/roles";
import {
  filterMenuItems,
  getMenuSummary,
  groupMenuItemsByCategory
} from "@/features/menu/calculations";
import { useDemoMenu } from "@/features/menu/demo-store";
import type { MenuCatalog, MenuDataSource } from "@/features/menu/types";
import { MenuCategoryTabs } from "./MenuCategoryTabs";
import { MenuItemCard } from "./MenuItemCard";
import { MenuSummaryCards } from "./MenuSummaryCards";
import { QRPanel } from "@/components/carta/QRPanel";

export function MenuWorkspace({
  roleId,
  initialCatalog,
  dataSource,
  persistAvailability,
  persistFeatured,
  restaurantId
}: {
  roleId: RoleId;
  initialCatalog?: MenuCatalog;
  dataSource: MenuDataSource;
  persistAvailability?: (itemId: string, available: boolean) => Promise<unknown>;
  persistFeatured?: (itemId: string, featured: boolean) => Promise<unknown>;
  restaurantId?: string;
}) {
  const { categories, items, toggleAvailability, toggleFeatured } = useDemoMenu(
    initialCatalog,
    restaurantId
  );
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const canEdit = roleId === "owner" || roleId === "admin";
  const isWaiter = roleId === "waiter";
  const summary = useMemo(() => getMenuSummary(items), [items]);
  const filteredItems = useMemo(
    () => filterMenuItems(items, { categoryId: activeCategoryId, query: search }),
    [activeCategoryId, items, search]
  );
  const groupedItems = useMemo(
    () => groupMenuItemsByCategory(categories, filteredItems),
    [categories, filteredItems]
  );
  const featuredItems = useMemo(
    () => items.filter((item) => item.featured && item.available).slice(0, 3),
    [items]
  );

  function handleAvailabilityToggle(itemId: string) {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    toggleAvailability(itemId);

    if (dataSource === "supabase" && persistAvailability) {
      startTransition(() => {
        void persistAvailability(itemId, !currentItem.available);
      });
    }
  }

  function handleFeaturedToggle(itemId: string) {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    toggleFeatured(itemId);

    if (dataSource === "supabase" && persistFeatured) {
      startTransition(() => {
        void persistFeatured(itemId, !currentItem.featured);
      });
    }
  }

  return (
    <section className="mx-auto max-w-[1320px] space-y-6">
      <div className={canEdit ? "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" : "grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"}>
        <section className="card-premium p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-3">{isWaiter ? "Consulta rápida" : "Carta operativa"}</p>
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                {isWaiter ? "Menú del turno" : "Gestión de productos y disponibilidad"}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-paper/58">
                {canEdit
                  ? dataSource === "supabase"
                    ? "La carta lee desde Supabase y mantiene una copia local sincronizada para no romper la demo."
                    : "Ajustá disponibilidad y destacados en modo demo. Los cambios persisten en localStorage y afectan la toma de pedidos."
                  : isWaiter
                    ? "Consultá carta, disponibilidad y productos destacados antes de cargar una mesa."
                    : "Supervisá la carta activa del turno sin editar precios ni disponibilidad."}
              </p>
            </div>

            <label className="block w-full max-w-sm">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/42">
                Buscar producto
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o descripción"
                className="w-full rounded-2xl border border-line bg-layer1/70 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              />
            </label>
          </div>

          <div className="mt-5">
            <MenuCategoryTabs
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
            />
          </div>
        </section>

        <section className="card-premium p-6">
          {canEdit ? (
            <>
              <p className="eyebrow mb-3">Resumen</p>
              <h3 className="text-2xl font-semibold">Estado de la carta</h3>
              <p className="mt-3 text-sm leading-7 text-paper/58">
                Este corte resume cuántos productos están en servicio, fuera de carta o destacados para el turno.
              </p>
              {isPending && (
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-paper/42">
                  Sincronizando cambios del menú...
                </p>
              )}
              <div className="mt-5">
                <MenuSummaryCards summary={summary} />
              </div>
              <div className="mt-6">
                <QRPanel />
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow mb-3">{isWaiter ? "Destacados" : "Supervisión"}</p>
              <h3 className="text-2xl font-semibold">
                {isWaiter ? "Referencia rápida para salón" : "Lectura del menú activo"}
              </h3>
              <div className="mt-5 space-y-3">
                {featuredItems.length > 0 ? (
                  featuredItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-line bg-layer1/60 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="mt-1 text-sm text-paper/55">{item.description}</p>
                        </div>
                        <p className="text-lg font-semibold text-gold">USD {item.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-line p-5 text-sm text-paper/45">
                    No hay destacados activos para este turno.
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Disponibles</p>
                  <p className="mt-2 text-3xl font-semibold text-gold">{summary.available}</p>
                </div>
                <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-paper/42">No disponibles</p>
                  <p className="mt-2 text-3xl font-semibold text-gold">{summary.unavailable}</p>
                </div>
                <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Destacados</p>
                  <p className="mt-2 text-3xl font-semibold text-gold">{summary.featured}</p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="space-y-6">
        {groupedItems.map((category) => (
          <section key={category.id}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Categoría</p>
                <h3 className="mt-2 text-2xl font-semibold text-gold">{category.name}</h3>
              </div>
              <div className="rounded-full border border-line bg-layer1/60 px-4 py-2 text-xs uppercase tracking-[0.18em] text-paper/45">
                {category.items.length} productos
              </div>
            </div>

            <div className={isWaiter ? "grid gap-4 md:grid-cols-2 2xl:grid-cols-3" : "grid gap-4 xl:grid-cols-2"}>
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  compact={isWaiter}
                  onToggleAvailability={handleAvailabilityToggle}
                  onToggleFeatured={handleFeaturedToggle}
                />
              ))}
            </div>
          </section>
        ))}

        {groupedItems.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line p-6 text-sm text-paper/45">
            No hay productos para ese filtro.
          </div>
        )}
      </div>
    </section>
  );
}

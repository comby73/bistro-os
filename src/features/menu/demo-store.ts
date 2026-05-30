"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getInitialMenuCatalog, normalizeMenuCatalog } from "./calculations";
import type { MenuCatalog, MenuItem, MenuItemInput, MenuItemPatch } from "./types";

export function newLocalItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ── Operaciones puras sobre el catálogo (testeables sin React) ───────────────

export function applyCreateItem(
  catalog: MenuCatalog,
  input: MenuItemInput,
  restaurantId: string,
  id: string = newLocalItemId()
): MenuCatalog {
  const item: MenuItem = {
    id,
    restaurant_id: restaurantId,
    category_id: input.category_id,
    name: input.name,
    description: input.description,
    price: input.price,
    station: input.station,
    available: input.available,
    featured: input.featured,
    image_url: input.image_url,
    status: "active"
  };
  return { ...catalog, items: [...catalog.items, item] };
}

export function applyUpdateItem(
  catalog: MenuCatalog,
  itemId: string,
  patch: MenuItemPatch
): MenuCatalog {
  return {
    ...catalog,
    items: catalog.items.map((item) =>
      item.id === itemId ? { ...item, ...patch } : item
    )
  };
}

export function applyArchiveItem(catalog: MenuCatalog, itemId: string): MenuCatalog {
  return {
    ...catalog,
    items: catalog.items.map((item) =>
      item.id === itemId
        ? { ...item, status: "archived" as const, available: false }
        : item
    )
  };
}

/** Filtra los productos archivados (baja lógica) para vistas públicas/operativas. */
export function visibleItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => item.status !== "archived");
}

const STORAGE_KEY = "bistro-demo-menu-v1";
const STORAGE_EVENT = "bistro-demo-menu-change";
const initialMenuSnapshot = getInitialMenuCatalog();

let cachedMenuCatalog: MenuCatalog = initialMenuSnapshot;
let cachedSerializedMenuCatalog = JSON.stringify(initialMenuSnapshot);

function updateMenuCache(nextCatalog: MenuCatalog) {
  const normalizedCatalog = normalizeMenuCatalog(nextCatalog);
  cachedMenuCatalog = normalizedCatalog;
  cachedSerializedMenuCatalog = JSON.stringify(normalizedCatalog);
}

export function readMenuCatalogSnapshot(): MenuCatalog {
  if (typeof window === "undefined") return cachedMenuCatalog;

  const storedCatalog = window.localStorage.getItem(STORAGE_KEY);

  if (!storedCatalog) return cachedMenuCatalog;
  if (storedCatalog === cachedSerializedMenuCatalog) return cachedMenuCatalog;

  try {
    updateMenuCache(JSON.parse(storedCatalog) as MenuCatalog);
    return cachedMenuCatalog;
  } catch {
    return cachedMenuCatalog;
  }
}

export function readMenuItemsSnapshot(): MenuItem[] {
  return readMenuCatalogSnapshot().items;
}

function writeMenuSnapshot(nextCatalog: MenuCatalog) {
  updateMenuCache(nextCatalog);
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedMenuCatalog);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function subscribe(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleChange = () => listener();

  window.addEventListener(STORAGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function useDemoMenu(initialCatalog?: MenuCatalog, restaurantId?: string) {
  const catalog = useSyncExternalStore(
    subscribe,
    readMenuCatalogSnapshot,
    () => cachedMenuCatalog
  );

  const items = visibleItems(
    restaurantId
      ? catalog.items.filter((item) => item.restaurant_id === restaurantId)
      : catalog.items
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.localStorage.getItem(STORAGE_KEY)) {
      writeMenuSnapshot(cachedMenuCatalog);
    }
  }, []);

  useEffect(() => {
    if (!initialCatalog || typeof window === "undefined") return;

    const normalizedInitial = normalizeMenuCatalog(initialCatalog);
    const serializedInitial = JSON.stringify(normalizedInitial);

    if (serializedInitial !== cachedSerializedMenuCatalog) {
      writeMenuSnapshot(normalizedInitial);
    }
  }, [initialCatalog]);

  const toggleAvailability = useCallback((itemId: string) => {
    const currentCatalog = readMenuCatalogSnapshot();
    const nextCatalog = {
      ...currentCatalog,
      items: currentCatalog.items.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    };

    writeMenuSnapshot(nextCatalog);
  }, []);

  const toggleFeatured = useCallback((itemId: string) => {
    const currentCatalog = readMenuCatalogSnapshot();
    const nextCatalog = {
      ...currentCatalog,
      items: currentCatalog.items.map((item) =>
        item.id === itemId ? { ...item, featured: !item.featured } : item
      )
    };

    writeMenuSnapshot(nextCatalog);
  }, []);

  const createItem = useCallback(
    (input: MenuItemInput, id?: string) => {
      if (!restaurantId) return;
      const next = applyCreateItem(readMenuCatalogSnapshot(), input, restaurantId, id);
      writeMenuSnapshot(next);
    },
    [restaurantId]
  );

  const updateItem = useCallback((itemId: string, patch: MenuItemPatch) => {
    writeMenuSnapshot(applyUpdateItem(readMenuCatalogSnapshot(), itemId, patch));
  }, []);

  const archiveItem = useCallback((itemId: string) => {
    writeMenuSnapshot(applyArchiveItem(readMenuCatalogSnapshot(), itemId));
  }, []);

  return {
    categories: catalog.categories,
    items,
    toggleAvailability,
    toggleFeatured,
    createItem,
    updateItem,
    archiveItem
  };
}

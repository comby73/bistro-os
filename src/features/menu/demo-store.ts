"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getInitialMenuCatalog, normalizeMenuCatalog } from "./calculations";
import type { MenuCatalog, MenuItem } from "./types";

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

export function useDemoMenu(initialCatalog?: MenuCatalog) {
  const catalog = useSyncExternalStore(
    subscribe,
    readMenuCatalogSnapshot,
    () => cachedMenuCatalog
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

  return {
    categories: catalog.categories,
    items: catalog.items,
    toggleAvailability,
    toggleFeatured
  };
}

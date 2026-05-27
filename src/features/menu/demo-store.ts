"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getInitialMenuItems, sortMenuItems } from "./calculations";
import type { MenuItem } from "./types";

const STORAGE_KEY = "bistro-demo-menu-v1";
const STORAGE_EVENT = "bistro-demo-menu-change";
const initialMenuSnapshot = getInitialMenuItems();

let cachedMenuItems: MenuItem[] = initialMenuSnapshot;
let cachedSerializedMenuItems = JSON.stringify(initialMenuSnapshot);

function updateMenuCache(nextItems: MenuItem[]) {
  const sortedItems = sortMenuItems(nextItems);
  cachedMenuItems = sortedItems;
  cachedSerializedMenuItems = JSON.stringify(sortedItems);
}

export function readMenuItemsSnapshot(): MenuItem[] {
  if (typeof window === "undefined") return cachedMenuItems;

  const storedItems = window.localStorage.getItem(STORAGE_KEY);

  if (!storedItems) return cachedMenuItems;
  if (storedItems === cachedSerializedMenuItems) return cachedMenuItems;

  try {
    updateMenuCache(JSON.parse(storedItems) as MenuItem[]);
    return cachedMenuItems;
  } catch {
    return cachedMenuItems;
  }
}

function writeMenuSnapshot(nextItems: MenuItem[]) {
  updateMenuCache(nextItems);
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedMenuItems);
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

export function useDemoMenu() {
  const items = useSyncExternalStore(subscribe, readMenuItemsSnapshot, () => cachedMenuItems);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.localStorage.getItem(STORAGE_KEY)) {
      writeMenuSnapshot(cachedMenuItems);
    }
  }, []);

  const toggleAvailability = useCallback((itemId: string) => {
    const currentItems = readMenuItemsSnapshot();
    const nextItems = currentItems.map((item) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    );

    writeMenuSnapshot(nextItems);
  }, []);

  const toggleFeatured = useCallback((itemId: string) => {
    const currentItems = readMenuItemsSnapshot();
    const nextItems = currentItems.map((item) =>
      item.id === itemId ? { ...item, featured: !item.featured } : item
    );

    writeMenuSnapshot(nextItems);
  }, []);

  return {
    items,
    toggleAvailability,
    toggleFeatured
  };
}

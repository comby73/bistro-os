"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { readMenuItemsSnapshot } from "@/features/menu/demo-store";
import {
  buildOrderFromInput,
  getInitialOrders,
  getNextOrderStatus,
  sortOrdersByNewest
} from "./calculations";
import type { CreateOrderInput, Order } from "./types";

const LEGACY_STORAGE_KEY = "bistro-demo-orders-v1";
const STORAGE_PREFIX = "bistro-demo-orders-v2";
const STORAGE_EVENT = "bistro-demo-orders-change";
const seedOrders = sortOrdersByNewest(getInitialOrders());

let cachedOrdersByRestaurant = new Map<string, Order[]>();
let cachedAllOrders = seedOrders;
let cachedSerializedByRestaurant = new Map<string, string>();

function storageKeyForRestaurant(restaurantId: string) {
  return `${STORAGE_PREFIX}-${restaurantId}`;
}

function getSeedOrdersForRestaurant(restaurantId: string) {
  return sortOrdersByNewest(seedOrders.filter((order) => order.restaurant_id === restaurantId));
}

function parseOrders(value: string | null): Order[] | null {
  if (!value) return null;

  try {
    return sortOrdersByNewest(JSON.parse(value) as Order[]);
  } catch {
    return null;
  }
}

function updateRestaurantCache(restaurantId: string, nextOrders: Order[]) {
  const sorted = sortOrdersByNewest(nextOrders);
  cachedOrdersByRestaurant.set(restaurantId, sorted);
  cachedSerializedByRestaurant.set(restaurantId, JSON.stringify(sorted));
  cachedAllOrders = sortOrdersByNewest([
    ...Array.from(cachedOrdersByRestaurant.values()).flat(),
    ...seedOrders.filter((order) => {
      const rid = order.restaurant_id;
      return rid && !cachedOrdersByRestaurant.has(rid);
    })
  ]);
}

function readLegacyOrdersForRestaurant(restaurantId: string): Order[] | null {
  if (typeof window === "undefined") return null;

  const legacyOrders = parseOrders(window.localStorage.getItem(LEGACY_STORAGE_KEY));
  if (!legacyOrders) return null;

  const restaurantOrders = legacyOrders.filter((order) => order.restaurant_id === restaurantId);
  return restaurantOrders.length > 0 ? restaurantOrders : null;
}

function readOrdersForRestaurant(restaurantId: string): Order[] {
  if (typeof window === "undefined") {
    return cachedOrdersByRestaurant.get(restaurantId) ?? getSeedOrdersForRestaurant(restaurantId);
  }

  const key = storageKeyForRestaurant(restaurantId);
  const stored = window.localStorage.getItem(key);
  const cachedSerialized = cachedSerializedByRestaurant.get(restaurantId);

  if (stored && stored === cachedSerialized) {
    return cachedOrdersByRestaurant.get(restaurantId) ?? [];
  }

  const parsed = parseOrders(stored);
  if (parsed) {
    updateRestaurantCache(restaurantId, parsed);
    return parsed;
  }

  const legacyOrders = readLegacyOrdersForRestaurant(restaurantId);
  if (legacyOrders) {
    updateRestaurantCache(restaurantId, legacyOrders);
    return legacyOrders;
  }

  const seeded = getSeedOrdersForRestaurant(restaurantId);
  updateRestaurantCache(restaurantId, seeded);
  return seeded;
}

function readOrdersSnapshot(): Order[] {
  return cachedAllOrders;
}

function writeOrdersForRestaurant(restaurantId: string, nextOrders: Order[]) {
  const scopedOrders = nextOrders.map((order) => ({ ...order, restaurant_id: restaurantId }));
  updateRestaurantCache(restaurantId, scopedOrders);
  window.localStorage.setItem(
    storageKeyForRestaurant(restaurantId),
    cachedSerializedByRestaurant.get(restaurantId) ?? "[]"
  );
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function ensureRestaurantStorage(restaurantId: string) {
  if (typeof window === "undefined") return;

  const key = storageKeyForRestaurant(restaurantId);
  if (window.localStorage.getItem(key)) {
    readOrdersForRestaurant(restaurantId);
    return;
  }

  const initialOrders = readLegacyOrdersForRestaurant(restaurantId) ?? getSeedOrdersForRestaurant(restaurantId);
  writeOrdersForRestaurant(restaurantId, initialOrders);
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

export function useDemoOrders(restaurantId?: string, branchId?: string | null) {
  const allOrders = useSyncExternalStore(subscribe, readOrdersSnapshot, () => cachedAllOrders);

  useEffect(() => {
    if (restaurantId) ensureRestaurantStorage(restaurantId);
  }, [restaurantId]);

  const orders = useMemo(
    () =>
      restaurantId
        ? sortOrdersByNewest(readOrdersForRestaurant(restaurantId))
        : allOrders,
    [allOrders, restaurantId]
  );

  const createOrder = useCallback(
    (input: CreateOrderInput) => {
      if (!restaurantId) return;

      const menuItems = readMenuItemsSnapshot().filter(
        (item) => item.restaurant_id === restaurantId && item.status !== "archived"
      );
      const builtOrder = buildOrderFromInput(input, menuItems, { restaurantId, branchId });
      const currentOrders = readOrdersForRestaurant(restaurantId);

      writeOrdersForRestaurant(restaurantId, [builtOrder, ...currentOrders]);
      return builtOrder; // necesario para sync a Supabase desde OrderComposer
    },
    [branchId, restaurantId]
  );

  const advanceOrderStatus = useCallback(
    (orderId: string) => {
      if (!restaurantId) return;

      const currentOrders = readOrdersForRestaurant(restaurantId);
      const nextOrders = currentOrders.map((order) => {
        if (order.id !== orderId) return order;

        const nextStatus = getNextOrderStatus(order.status);
        return nextStatus ? { ...order, status: nextStatus } : order;
      });

      writeOrdersForRestaurant(restaurantId, nextOrders);
    },
    [restaurantId]
  );

  return {
    orders,
    createOrder,
    advanceOrderStatus
  };
}

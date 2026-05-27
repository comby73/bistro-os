"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { readMenuItemsSnapshot } from "@/features/menu/demo-store";
import {
  buildOrderFromInput,
  getInitialOrders,
  getNextOrderStatus,
  sortOrdersByNewest
} from "./calculations";
import type { CreateOrderInput, Order } from "./types";

const STORAGE_KEY = "bistro-demo-orders-v1";
const STORAGE_EVENT = "bistro-demo-orders-change";
const initialOrdersSnapshot = sortOrdersByNewest(getInitialOrders());

let cachedOrders: Order[] = initialOrdersSnapshot;
let cachedSerializedOrders = JSON.stringify(initialOrdersSnapshot);

function updateOrdersCache(nextOrders: Order[]) {
  cachedOrders = nextOrders;
  cachedSerializedOrders = JSON.stringify(nextOrders);
}

function readOrdersSnapshot(): Order[] {
  if (typeof window === "undefined") return cachedOrders;

  const storedOrders = window.localStorage.getItem(STORAGE_KEY);

  if (!storedOrders) return cachedOrders;

  if (storedOrders === cachedSerializedOrders) {
    return cachedOrders;
  }

  try {
    const parsedOrders = sortOrdersByNewest(JSON.parse(storedOrders) as Order[]);
    updateOrdersCache(parsedOrders);
    return cachedOrders;
  } catch {
    return cachedOrders;
  }
}

function writeOrdersSnapshot(nextOrders: Order[]) {
  updateOrdersCache(nextOrders);
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedOrders);
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

export function useDemoOrders() {
  const orders = useSyncExternalStore(subscribe, readOrdersSnapshot, () => cachedOrders);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.localStorage.getItem(STORAGE_KEY)) {
      writeOrdersSnapshot(cachedOrders);
    }
  }, []);

  const createOrder = useCallback((input: CreateOrderInput) => {
    const nextOrder = buildOrderFromInput(input, readMenuItemsSnapshot());
    const currentOrders = readOrdersSnapshot();

    writeOrdersSnapshot(sortOrdersByNewest([nextOrder, ...currentOrders]));
  }, []);

  const advanceOrderStatus = useCallback((orderId: string) => {
    const currentOrders = readOrdersSnapshot();
    const nextOrders = currentOrders.map((order) => {
      if (order.id !== orderId) return order;

      const nextStatus = getNextOrderStatus(order.status);
      return nextStatus ? { ...order, status: nextStatus } : order;
    });

    writeOrdersSnapshot(sortOrdersByNewest(nextOrders));
  }, []);

  return {
    orders,
    createOrder,
    advanceOrderStatus
  };
}

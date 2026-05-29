"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getBranchById,
  getDefaultBranchForRestaurant,
  getRestaurantById
} from "./mock-data";
import type { Branch, Restaurant } from "./types";

export const RESTAURANT_COOKIE = "bistro_restaurant_id";
export const BRANCH_COOKIE = "bistro_branch_id";

const STORAGE_EVENT = "bistro-active-restaurant-change";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function readId(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

interface ActiveRestaurantSnapshot {
  restaurantId: string | null;
  branchId: string | null;
}

let cachedSnapshot: ActiveRestaurantSnapshot = { restaurantId: null, branchId: null };

function computeSnapshot(): ActiveRestaurantSnapshot {
  return {
    restaurantId: readId(RESTAURANT_COOKIE),
    branchId: readId(BRANCH_COOKIE)
  };
}

function readSnapshot(): ActiveRestaurantSnapshot {
  if (typeof window === "undefined") return cachedSnapshot;

  const next = computeSnapshot();
  if (next.restaurantId !== cachedSnapshot.restaurantId || next.branchId !== cachedSnapshot.branchId) {
    cachedSnapshot = next;
  }
  return cachedSnapshot;
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

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function useActiveRestaurant(): {
  restaurantId: string | null;
  branchId: string | null;
  restaurant: Restaurant | null;
  branch: Branch | null;
  setSession: (restaurantId: string, branchId?: string) => void;
  clearSession: () => void;
} {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => cachedSnapshot);

  const setSession = useCallback((restaurantId: string, branchId?: string) => {
    if (typeof window === "undefined") return;

    const resolvedBranchId =
      branchId ?? getDefaultBranchForRestaurant(restaurantId)?.id ?? "";

    window.localStorage.setItem(RESTAURANT_COOKIE, restaurantId);
    setCookie(RESTAURANT_COOKIE, restaurantId);

    if (resolvedBranchId) {
      window.localStorage.setItem(BRANCH_COOKIE, resolvedBranchId);
      setCookie(BRANCH_COOKIE, resolvedBranchId);
    }

    cachedSnapshot = { restaurantId, branchId: resolvedBranchId || null };
    notify();
  }, []);

  const clearSession = useCallback(() => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(RESTAURANT_COOKIE);
    window.localStorage.removeItem(BRANCH_COOKIE);
    deleteCookie(RESTAURANT_COOKIE);
    deleteCookie(BRANCH_COOKIE);

    cachedSnapshot = { restaurantId: null, branchId: null };
    notify();
  }, []);

  return {
    restaurantId: snapshot.restaurantId,
    branchId: snapshot.branchId,
    restaurant: getRestaurantById(snapshot.restaurantId),
    branch: getBranchById(snapshot.branchId),
    setSession,
    clearSession
  };
}

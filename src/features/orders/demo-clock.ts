"use client";

import { useSyncExternalStore } from "react";

let currentTime = 0;
let intervalId: number | null = null;
const listeners = new Set<() => void>();

function emitCurrentTime() {
  currentTime = Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined" && currentTime === 0) {
    currentTime = Date.now();
    window.setTimeout(listener, 0);
  }

  if (typeof window !== "undefined" && intervalId === null) {
    intervalId = window.setInterval(emitCurrentTime, 30_000);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

export function useDemoClock() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

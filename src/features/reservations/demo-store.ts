"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  buildReservationFromInput,
  getInitialReservations,
  sortReservations
} from "./calculations";
import type { CreateReservationInput, Reservation, ReservationStatus } from "./types";

const STORAGE_KEY = "bistro-demo-reservations-v1";
const STORAGE_EVENT = "bistro-demo-reservations-change";
const initialReservationsSnapshot = sortReservations(getInitialReservations());

let cachedReservations: Reservation[] = initialReservationsSnapshot;
let cachedSerializedReservations = JSON.stringify(initialReservationsSnapshot);

function updateReservationsCache(nextReservations: Reservation[]) {
  cachedReservations = nextReservations;
  cachedSerializedReservations = JSON.stringify(nextReservations);
}

function readReservationsSnapshot(): Reservation[] {
  if (typeof window === "undefined") return cachedReservations;

  const storedReservations = window.localStorage.getItem(STORAGE_KEY);

  if (!storedReservations) return cachedReservations;
  if (storedReservations === cachedSerializedReservations) return cachedReservations;

  try {
    const parsedReservations = sortReservations(
      JSON.parse(storedReservations) as Reservation[]
    );
    updateReservationsCache(parsedReservations);
    return cachedReservations;
  } catch {
    return cachedReservations;
  }
}

function writeReservationsSnapshot(nextReservations: Reservation[]) {
  updateReservationsCache(sortReservations(nextReservations));
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedReservations);
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

export function useDemoReservations() {
  const reservations = useSyncExternalStore(
    subscribe,
    readReservationsSnapshot,
    () => cachedReservations
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.localStorage.getItem(STORAGE_KEY)) {
      writeReservationsSnapshot(cachedReservations);
    }
  }, []);

  const createReservation = useCallback((input: CreateReservationInput) => {
    const nextReservation = buildReservationFromInput(input);
    const currentReservations = readReservationsSnapshot();

    writeReservationsSnapshot([...currentReservations, nextReservation]);
  }, []);

  const updateReservationStatus = useCallback(
    (reservationId: string, status: ReservationStatus) => {
      const currentReservations = readReservationsSnapshot();
      const nextReservations = currentReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      );

      writeReservationsSnapshot(nextReservations);
    },
    []
  );

  const assignReservationTable = useCallback(
    (reservationId: string, tableAssigned: string) => {
      const currentReservations = readReservationsSnapshot();
      const nextReservations = currentReservations.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              table_assigned: tableAssigned.trim() || undefined
            }
          : reservation
      );

      writeReservationsSnapshot(nextReservations);
    },
    []
  );

  return {
    reservations,
    createReservation,
    updateReservationStatus,
    assignReservationTable
  };
}

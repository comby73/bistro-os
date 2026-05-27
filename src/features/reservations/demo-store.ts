"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  buildReservationFromInput,
  getInitialReservations,
  sortReservations
} from "./calculations";
import type {
  CreateReservationInput,
  Reservation,
  ReservationsDataSource,
  ReservationStatus
} from "./types";

const STORAGE_KEY = "bistro-demo-reservations-v1";
const STORAGE_EVENT = "bistro-demo-reservations-change";
const initialReservationsSnapshot = sortReservations(getInitialReservations());

let cachedReservations: Reservation[] = initialReservationsSnapshot;
let cachedSerializedReservations = JSON.stringify(initialReservationsSnapshot);

function updateReservationsCache(nextReservations: Reservation[]) {
  const sortedReservations = sortReservations(nextReservations);
  cachedReservations = sortedReservations;
  cachedSerializedReservations = JSON.stringify(sortedReservations);
}

function readReservationsSnapshot(): Reservation[] {
  if (typeof window === "undefined") return cachedReservations;

  const storedReservations = window.localStorage.getItem(STORAGE_KEY);

  if (!storedReservations) return cachedReservations;
  if (storedReservations === cachedSerializedReservations) return cachedReservations;

  try {
    updateReservationsCache(JSON.parse(storedReservations) as Reservation[]);
    return cachedReservations;
  } catch {
    return cachedReservations;
  }
}

function writeReservationsSnapshot(nextReservations: Reservation[]) {
  updateReservationsCache(nextReservations);
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedReservations);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function replaceReservationSnapshot(tempId: string, nextReservation: Reservation) {
  const currentReservations = readReservationsSnapshot();
  const nextReservations = currentReservations.map((reservation) =>
    reservation.id === tempId ? nextReservation : reservation
  );

  writeReservationsSnapshot(nextReservations);
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

export function useDemoReservations({
  initialReservations,
  dataSource = "local",
  persistCreate,
  persistStatus,
  persistTable,
  persistCancel
}: {
  initialReservations?: Reservation[];
  dataSource?: ReservationsDataSource;
  persistCreate?: (input: CreateReservationInput) => Promise<{ reservation?: Reservation }>;
  persistStatus?: (
    reservationId: string,
    status: ReservationStatus
  ) => Promise<unknown>;
  persistTable?: (reservationId: string, tableAssigned: string) => Promise<unknown>;
  persistCancel?: (reservationId: string) => Promise<unknown>;
} = {}) {
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

  useEffect(() => {
    if (!initialReservations || typeof window === "undefined") return;

    const sortedInitialReservations = sortReservations(initialReservations);
    const serializedInitialReservations = JSON.stringify(sortedInitialReservations);

    if (serializedInitialReservations !== cachedSerializedReservations) {
      writeReservationsSnapshot(sortedInitialReservations);
    }
  }, [initialReservations]);

  const createReservation = useCallback(
    (input: CreateReservationInput) => {
      const nextReservation = buildReservationFromInput(input);
      const currentReservations = readReservationsSnapshot();

      writeReservationsSnapshot([...currentReservations, nextReservation]);

      if (dataSource === "supabase" && persistCreate) {
        void persistCreate(input).then((result) => {
          if (result?.reservation) {
            replaceReservationSnapshot(nextReservation.id, result.reservation);
          }
        });
      }
    },
    [dataSource, persistCreate]
  );

  const updateReservationStatus = useCallback(
    (reservationId: string, status: ReservationStatus) => {
      const currentReservations = readReservationsSnapshot();
      const nextReservations = currentReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      );

      writeReservationsSnapshot(nextReservations);

      if (dataSource === "supabase") {
        if (status === "cancelled" && persistCancel) {
          void persistCancel(reservationId);
          return;
        }

        if (persistStatus) {
          void persistStatus(reservationId, status);
        }
      }
    },
    [dataSource, persistCancel, persistStatus]
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

      if (dataSource === "supabase" && persistTable) {
        void persistTable(reservationId, tableAssigned);
      }
    },
    [dataSource, persistTable]
  );

  return {
    reservations,
    createReservation,
    updateReservationStatus,
    assignReservationTable
  };
}

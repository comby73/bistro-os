import { demoReservations } from "@/features/restaurants/mock-data";
import { reservations as baseReservations } from "./mock-data";
import type {
  CreateReservationInput,
  Reservation,
  ReservationFilter,
  ReservationStatus
} from "./types";

// Base reservations have no restaurant_id (legacy demo, shown only in the no-session
// fallback). The multi-restaurant demo reservations carry restaurant_id/branch_id.
const seedReservations: Reservation[] = [...baseReservations, ...demoReservations];

export function getInitialReservations(): Reservation[] {
  return [...seedReservations];
}

export function sortReservations(
  reservations: Reservation[]
): Reservation[] {
  return [...reservations].sort((left, right) => {
    const leftKey = `${left.date}T${left.time}`;
    const rightKey = `${right.date}T${right.time}`;

    return leftKey.localeCompare(rightKey);
  });
}

export function buildReservationFromInput(
  input: CreateReservationInput
): Reservation {
  return {
    id: `RES-${Math.floor(Date.now() / 1000)}`,
    customer_name: input.customer_name.trim(),
    contact_phone: input.contact_phone.trim(),
    date: input.date,
    time: input.time,
    party_size: input.party_size,
    status: "pending",
    table_assigned: input.table_assigned?.trim() || undefined,
    notes: input.notes?.trim() || undefined
  };
}

export function getReservationStatusLabel(status: ReservationStatus): string {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmada";
  if (status === "seated") return "Sentada";
  if (status === "cancelled") return "Cancelada";
  return "Completada";
}

export function filterReservations(
  reservations: Reservation[],
  filter: ReservationFilter
): Reservation[] {
  if (filter === "all") return reservations;
  return reservations.filter((reservation) => reservation.status === filter);
}

export function getTodayReservations(
  reservations: Reservation[],
  today: string
): Reservation[] {
  return reservations.filter((reservation) => reservation.date === today);
}

export function getReservationCounts(reservations: Reservation[]) {
  return {
    pending: reservations.filter((reservation) => reservation.status === "pending").length,
    confirmed: reservations.filter((reservation) => reservation.status === "confirmed").length,
    seated: reservations.filter((reservation) => reservation.status === "seated").length,
    cancelled: reservations.filter((reservation) => reservation.status === "cancelled").length,
    completed: reservations.filter((reservation) => reservation.status === "completed").length
  };
}

export function getNextUpcomingReservation(
  reservations: Reservation[],
  today: string,
  nowTime: string
): Reservation | null {
  const upcomingReservations = reservations.filter((reservation) => {
    if (reservation.status === "cancelled" || reservation.status === "completed") return false;
    if (reservation.date < today) return false;
    if (reservation.date === today && reservation.time < nowTime) return false;
    return true;
  });

  return sortReservations(upcomingReservations)[0] ?? null;
}

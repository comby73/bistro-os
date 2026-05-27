"use server";

import type { CreateReservationInput, ReservationStatus } from "./types";
import {
  cancelReservation as cancelReservationInRepository,
  createReservation as createReservationInRepository,
  updateReservationStatus as updateReservationStatusInRepository,
  updateReservationTable as updateReservationTableInRepository
} from "./repository";

export async function createReservationAction(input: CreateReservationInput) {
  return createReservationInRepository(input);
}

export async function updateReservationStatusAction(
  reservationId: string,
  status: ReservationStatus
) {
  return updateReservationStatusInRepository(reservationId, status);
}

export async function updateReservationTableAction(
  reservationId: string,
  tableAssigned: string
) {
  return updateReservationTableInRepository(reservationId, tableAssigned);
}

export async function cancelReservationAction(reservationId: string) {
  return cancelReservationInRepository(reservationId);
}

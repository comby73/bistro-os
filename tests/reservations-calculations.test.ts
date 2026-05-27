import { describe, expect, it } from "vitest";
import {
  buildReservationFromInput,
  filterReservations,
  getReservationCounts,
  getReservationStatusLabel,
  getTodayReservations,
  sortReservations
} from "../src/features/reservations/calculations";
import { reservations } from "../src/features/reservations/mock-data";

describe("reservations calculations", () => {
  it("crea una reserva nueva en estado pending", () => {
    const reservation = buildReservationFromInput({
      customer_name: "Cliente Demo",
      contact_phone: "+54 9 11 1234 5678",
      date: "2026-06-02",
      time: "21:30",
      party_size: 4,
      table_assigned: "Mesa 4",
      notes: "Sin TACC"
    });

    expect(reservation.status).toBe("pending");
    expect(reservation.table_assigned).toBe("Mesa 4");
  });

  it("filtra y ordena reservas por estado/fecha", () => {
    expect(filterReservations(reservations, "confirmed")).toHaveLength(1);
    expect(filterReservations(reservations, "seated")).toHaveLength(1);
    expect(sortReservations(reservations)[0].time <= sortReservations(reservations)[1].time).toBe(true);
  });

  it("devuelve etiquetas de estado legibles", () => {
    expect(getReservationStatusLabel("pending")).toBe("Pendiente");
    expect(getReservationStatusLabel("confirmed")).toBe("Confirmada");
    expect(getReservationStatusLabel("seated")).toBe("Sentada");
    expect(getReservationStatusLabel("cancelled")).toBe("Cancelada");
    expect(getReservationStatusLabel("completed")).toBe("Completada");
  });

  it("resume estados y recorta reservas del día", () => {
    const counts = getReservationCounts(reservations);

    expect(counts.pending).toBe(1);
    expect(counts.confirmed).toBe(1);
    expect(counts.seated).toBe(1);

    const todayReservations = getTodayReservations(reservations, reservations[0].date);
    expect(todayReservations.length).toBeGreaterThan(0);
  });
});

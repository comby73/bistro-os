import type { Reservation } from "./types";

export const reservations: Reservation[] = [
  {
    id: "RES-2301",
    customer_name: "Mariana López",
    date: "2026-06-02",
    time: "21:00",
    party_size: 4,
    status: "pending",
    notes: "Mesa tranquila, aniversario."
  },
  {
    id: "RES-2302",
    customer_name: "Diego Ferrer",
    date: "2026-06-02",
    time: "22:00",
    party_size: 2,
    status: "confirmed"
  },
  {
    id: "RES-2303",
    customer_name: "Valeria Costa",
    date: "2026-06-03",
    time: "20:30",
    party_size: 6,
    status: "confirmed",
    notes: "Consultar opciones vegetarianas."
  }
];

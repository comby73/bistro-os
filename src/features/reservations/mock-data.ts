import type { Reservation } from "./types";

function addDays(base: Date, days: number) {
  const nextDate = new Date(base);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

const today = new Date();

export const reservations: Reservation[] = [
  {
    id: "RES-2301",
    customer_name: "Mariana López",
    contact_phone: "+54 9 11 4567 8899",
    date: addDays(today, 0),
    time: "21:00",
    party_size: 4,
    status: "pending",
    table_assigned: "Mesa 8",
    notes: "Mesa tranquila, aniversario."
  },
  {
    id: "RES-2302",
    customer_name: "Diego Ferrer",
    contact_phone: "+54 9 11 3344 9922",
    date: addDays(today, 0),
    time: "22:00",
    party_size: 2,
    status: "confirmed",
    table_assigned: "Mesa 2"
  },
  {
    id: "RES-2303",
    customer_name: "Valeria Costa",
    contact_phone: "+54 9 11 6677 1100",
    date: addDays(today, 1),
    time: "20:30",
    party_size: 6,
    status: "seated",
    table_assigned: "Mesa 12",
    notes: "Consultar opciones vegetarianas."
  }
];

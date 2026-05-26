import type { KitchenTicket } from "./types";

export const kitchenTickets: KitchenTicket[] = [
  {
    id: "KDS-1",
    order_id: "ORD-1042",
    table: "Mesa 7",
    station: "hot",
    status: "preparing",
    elapsed_minutes: 12,
    items: ["1× Risotto de hongos"]
  },
  {
    id: "KDS-2",
    order_id: "ORD-1043",
    table: "Mesa 11",
    station: "grill",
    status: "received",
    elapsed_minutes: 4,
    items: ["2× Cordero patagónico"]
  },
  {
    id: "KDS-3",
    order_id: "ORD-1043",
    table: "Mesa 11",
    station: "bar",
    status: "ready",
    elapsed_minutes: 7,
    items: ["2× Negroni"]
  }
];

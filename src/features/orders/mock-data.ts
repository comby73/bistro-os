import type { Order } from "./types";

export const orders: Order[] = [
  {
    id: "ORD-1042",
    table: "Mesa 7",
    status: "preparing",
    created_at: "20:14",
    items: [
      { name: "Tartar de atún", quantity: 2, station: "cold" },
      { name: "Risotto de hongos", quantity: 1, station: "hot" }
    ]
  },
  {
    id: "ORD-1043",
    table: "Mesa 11",
    status: "received",
    created_at: "20:18",
    items: [
      { name: "Cordero patagónico", quantity: 2, station: "grill" },
      { name: "Negroni", quantity: 2, station: "bar" }
    ]
  }
];

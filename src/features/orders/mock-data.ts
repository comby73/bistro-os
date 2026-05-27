import type { Order } from "./types";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const orders: Order[] = [
  {
    id: "ORD-1042",
    table: "Mesa 7",
    status: "preparing",
    created_at: minutesAgo(12),
    waiter_name: "Martina",
    notes: "Salida primero la entrada. Cliente alérgico a nueces.",
    items: [
      {
        menu_item_id: "item-1",
        name: "Tartar de atún rojo",
        quantity: 2,
        station: "cold",
        unit_price: 28
      },
      {
        menu_item_id: "item-2",
        name: "Risotto de hongos",
        quantity: 1,
        station: "hot",
        unit_price: 24
      }
    ]
  },
  {
    id: "ORD-1043",
    table: "Mesa 11",
    status: "received",
    created_at: minutesAgo(4),
    waiter_name: "Nicolás",
    notes: "Sin hielo en coctelería.",
    items: [
      {
        menu_item_id: "item-4",
        name: "Cordero patagónico",
        quantity: 2,
        station: "grill",
        unit_price: 38
      },
      {
        menu_item_id: "item-3",
        name: "Negroni de la casa",
        quantity: 2,
        station: "bar",
        unit_price: 12
      }
    ]
  }
];

import type { Order } from "./types";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

// IDs referenciados desde menu/mock-data.ts — actualizar si cambian los del menú
export const orders: Order[] = [
  {
    id: "ORD-1042",
    restaurant_id: "rest-bistro",
    table: "Mesa 7",
    status: "preparing",
    created_at: minutesAgo(12),
    waiter_name: "Martina",
    notes: "Salida primero la entrada. Cliente alérgico a nueces.",
    items: [
      { menu_item_id: "item-ent-1", name: "Burrata con tomates confitados", quantity: 1, station: "cold",  unit_price: 22 },
      { menu_item_id: "item-pri-1", name: "Risotto de hongos patagónicos",  quantity: 2, station: "hot",   unit_price: 26 },
      { menu_item_id: "item-beb-1", name: "Limonada de menta y jengibre",   quantity: 2, station: "bar",   unit_price: 8  },
    ],
  },
  {
    id: "ORD-1043",
    restaurant_id: "rest-bistro",
    table: "Mesa 11",
    status: "received",
    created_at: minutesAgo(4),
    waiter_name: "Nicolás",
    notes: "Sin hielo en las bebidas.",
    items: [
      { menu_item_id: "item-par-1", name: "Ojo de bife con papas rotas",        quantity: 2, station: "grill", unit_price: 42 },
      { menu_item_id: "item-par-2", name: "Entraña marinada con chimichurri",    quantity: 1, station: "grill", unit_price: 34 },
      { menu_item_id: "item-beb-4", name: "Mocktail de frutos rojos",            quantity: 2, station: "bar",   unit_price: 10 },
    ],
  },
  {
    id: "ORD-1044",
    restaurant_id: "rest-bistro",
    table: "Mesa 3",
    status: "delivered",
    created_at: minutesAgo(35),
    waiter_name: "Sofía",
    items: [
      { menu_item_id: "item-ent-2", name: "Croquetas de osobuco braseado", quantity: 2, station: "hot",  unit_price: 19 },
      { menu_item_id: "item-pri-3", name: "Salmón grillado con puré",      quantity: 1, station: "grill",unit_price: 32 },
      { menu_item_id: "item-pos-1", name: "Tiramisú de la casa",           quantity: 2, station: "cold", unit_price: 14 },
      { menu_item_id: "item-beb-3", name: "Espresso",                      quantity: 2, station: "bar",  unit_price: 5  },
    ],
  },
];

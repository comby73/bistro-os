import type { Order } from "./types";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

// restaurant_id usa los UUID reales de Supabase (tabla restaurants)
const RID = {
  bistro:    "00000000-0000-0000-0000-000000000001",
  casaNorte: "00000000-0000-0000-0000-000000000002",
  mesa:      "00000000-0000-0000-0000-000000000003",
} as const;

// Pedidos demo en memoria (no persistidos). Filtrados por restaurant_id en demo-store.
export const orders: Order[] = [
  {
    id: "ORD-1042",
    restaurant_id: RID.bistro,
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
    restaurant_id: RID.bistro,
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
    restaurant_id: RID.bistro,
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

  // ── Casa Norte ──────────────────────────────────────────────
  {
    id: "ORD-2051",
    restaurant_id: RID.casaNorte,
    table: "Mesa 5",
    status: "preparing",
    created_at: minutesAgo(9),
    waiter_name: "Pablo",
    notes: "Empanadas bien calientes.",
    items: [
      { menu_item_id: "cn-ent-1", name: "Empanadas salteñas", quantity: 2, station: "hot", unit_price: 18 },
      { menu_item_id: "cn-pri-1", name: "Locro norteño",      quantity: 2, station: "hot", unit_price: 22 },
      { menu_item_id: "cn-beb-1", name: "Torrontés salteño",  quantity: 2, station: "bar", unit_price: 9  },
    ],
  },
  {
    id: "ORD-2052",
    restaurant_id: RID.casaNorte,
    table: "Mesa 2",
    status: "received",
    created_at: minutesAgo(3),
    waiter_name: "Pablo",
    items: [
      { menu_item_id: "cn-par-1", name: "Chivito a las brasas", quantity: 1, station: "grill", unit_price: 38 },
      { menu_item_id: "cn-beb-2", name: "Chicha de maíz",       quantity: 3, station: "bar",   unit_price: 7  },
    ],
  },

  // ── La Mesa Dorada ──────────────────────────────────────────
  {
    id: "ORD-3061",
    restaurant_id: RID.mesa,
    table: "Mesa 9",
    status: "preparing",
    created_at: minutesAgo(15),
    waiter_name: "Daniela",
    notes: "Bife a punto.",
    items: [
      { menu_item_id: "md-par-1", name: "Bife de chorizo 400g", quantity: 2, station: "grill", unit_price: 34 },
      { menu_item_id: "md-ent-1", name: "Provoleta a la parrilla", quantity: 1, station: "grill", unit_price: 16 },
      { menu_item_id: "md-beb-1", name: "Malbec de guarda",     quantity: 2, station: "bar",   unit_price: 11 },
    ],
  },
  {
    id: "ORD-3062",
    restaurant_id: RID.mesa,
    table: "Mesa 1",
    status: "received",
    created_at: minutesAgo(6),
    waiter_name: "Daniela",
    items: [
      { menu_item_id: "md-par-2", name: "Asado de tira",      quantity: 1, station: "grill", unit_price: 30 },
      { menu_item_id: "md-pos-1", name: "Flan con crema",     quantity: 2, station: "cold",  unit_price: 12 },
    ],
  },
];

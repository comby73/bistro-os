import type { MenuCategory, MenuItem } from "./types";

export const menuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Entradas", position: 1 },
  { id: "cat-2", name: "Principales", position: 2 },
  { id: "cat-3", name: "Coctelería", position: 3 }
];

export const menuItems: MenuItem[] = [
  {
    id: "item-1",
    restaurant_id: "rest-bistro",
    category_id: "cat-1",
    name: "Tartar de atún rojo",
    description: "Palta cremosa, sésamo tostado y soja cítrica. Una entrada fresca que despierta el paladar con textura y profundidad marina.",
    price: 28,
    station: "cold",
    available: true,
    featured: true,
    image_url: "/tartar-atun.jpg"
  },
  {
    id: "item-2",
    restaurant_id: "rest-bistro",
    category_id: "cat-2",
    name: "Risotto de hongos",
    description: "Hongos de estación salteados a fuego vivo, fundidos en arroz cremoso con parmesano añejo y un hilo de aceite de trufa. Reconfortante y elegante.",
    price: 24,
    station: "hot",
    available: true,
    featured: false,
    image_url: "/risotto-hongos.jpg"
  },
  {
    id: "item-4",
    restaurant_id: "rest-bistro",
    category_id: "cat-2",
    name: "Cordero patagónico",
    description: "Cocción lenta para una carne que se deshace sola. Puré ahumado, jugo reducido de cocción y hierbas frescas de temporada. El plato de la casa.",
    price: 38,
    station: "grill",
    available: true,
    featured: true,
    image_url: "/cordero-patagonico.jpg"
  },
  {
    id: "item-3",
    restaurant_id: "rest-bistro",
    category_id: "cat-3",
    name: "Negroni de la casa",
    description: "Nuestra versión del clásico: gin artesanal, bitter seleccionado, vermut rojo y twist de naranja. Amargo, complejo y adictivo.",
    price: 12,
    station: "bar",
    available: true,
    featured: false,
    image_url: "/aperol.jpg"
  }
];

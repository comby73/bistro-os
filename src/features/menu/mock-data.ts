import type { MenuCategory, MenuItem } from "./types";

export const menuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Entradas", position: 1 },
  { id: "cat-2", name: "Principales", position: 2 },
  { id: "cat-3", name: "Coctelería", position: 3 }
];

export const menuItems: MenuItem[] = [
  {
    id: "item-1",
    category_id: "cat-1",
    name: "Tartar de atún rojo",
    description: "Palta, sésamo, soja cítrica.",
    price: 28,
    station: "cold",
    available: true,
    featured: true
  },
  {
    id: "item-2",
    category_id: "cat-2",
    name: "Risotto de hongos",
    description: "Hongos de estación, parmesano, aceite de trufa.",
    price: 24,
    station: "hot",
    available: true,
    featured: false
  },
  {
    id: "item-4",
    category_id: "cat-2",
    name: "Cordero patagónico",
    description: "Puré ahumado, jugo reducido, hierbas de temporada.",
    price: 38,
    station: "grill",
    available: true,
    featured: true
  },
  {
    id: "item-3",
    category_id: "cat-3",
    name: "Negroni de la casa",
    description: "Gin, bitter, vermut rojo, naranja.",
    price: 12,
    station: "bar",
    available: true,
    featured: false
  }
];

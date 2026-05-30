import type { MenuCategory, MenuItem } from "./types";
import catalog from "./catalog.json";

// ─────────────────────────────────────────────────────────────────────────────
// FUENTE ÚNICA DE CATÁLOGO (dev fallback)
//
// Los datos viven en ./catalog.json y son consumidos por:
//   1. La app (este módulo) como FALLBACK cuando Supabase no está configurado.
//   2. scripts/seed-menu.mjs para poblar Supabase (fuente de verdad real).
//
// En producción/demo con Supabase configurado, /menu y /carta leen de Supabase.
// Este mock solo se usa si faltan las variables de entorno o Supabase falla.
// ─────────────────────────────────────────────────────────────────────────────

// IDs de Supabase — deben coincidir con la tabla restaurants
export const RESTAURANT_IDS = catalog.restaurantIds as {
  bistro: string;
  casaNorte: string;
  mesa: string;
};

// Mapa restaurant_id → branch principal (para el seed)
export const BRANCH_IDS = catalog.branchIds as Record<string, string>;

export const menuCategories: MenuCategory[] = catalog.categories as MenuCategory[];

export const menuItems: MenuItem[] = catalog.items as unknown as MenuItem[];

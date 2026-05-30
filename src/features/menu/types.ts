import type { KitchenStation } from "@/features/kitchen/types";

export interface MenuCategory {
  id: string;
  name: string;
  position?: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  station: KitchenStation;
  available: boolean;
  featured: boolean;
  image_url?: string;
  /** "archived" = baja lógica (oculto). Ausente/"active" = visible. */
  status?: "active" | "archived";
}

/** Datos para crear un producto nuevo (restaurant_id/branch_id los inyecta el server). */
export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  category_id: string;
  station: KitchenStation;
  available: boolean;
  featured: boolean;
  image_url?: string;
}

/** Edición parcial de un producto existente. */
export type MenuItemPatch = Partial<MenuItemInput> & {
  status?: "active" | "archived";
};

/** Resultado de una mutación de menú (para distinguir fuente y éxito). */
export interface MenuMutationResult {
  dataSource: MenuDataSource;
  updated: boolean;
  itemId?: string;
}

export interface MenuSummary {
  total: number;
  available: number;
  unavailable: number;
  featured: number;
}

export interface MenuCatalog {
  categories: MenuCategory[];
  items: MenuItem[];
}

export type MenuDataSource = "local" | "supabase";

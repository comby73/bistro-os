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

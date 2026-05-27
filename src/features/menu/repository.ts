import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getInitialMenuCatalog,
  normalizeMenuCatalog
} from "./calculations";
import type { MenuCatalog, MenuCategory, MenuDataSource, MenuItem } from "./types";

type MenuCategoryRow = {
  id: string;
  name: string;
  position: number | null;
};

type MenuItemRow = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  base_price: number | string;
  station: MenuItem["station"];
  available: boolean;
  featured: boolean;
  status: string;
};

type MenuRepositoryEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export interface MenuCatalogResult extends MenuCatalog {
  dataSource: MenuDataSource;
}

function getSupabaseEnv(env: MenuRepositoryEnv = process.env as MenuRepositoryEnv) {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  };
}

export function resolveMenuDataSource(
  env: MenuRepositoryEnv = process.env as MenuRepositoryEnv
): MenuDataSource {
  return env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY
    ? "supabase"
    : "local";
}

function mapCategoryRows(rows: MenuCategoryRow[]): MenuCategory[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    position: row.position ?? undefined
  }));
}

function mapItemRows(rows: MenuItemRow[]): MenuItem[] {
  return rows
    .filter((row) => row.category_id)
    .map((row) => ({
      id: row.id,
      category_id: row.category_id as string,
      name: row.name,
      description: row.description ?? "",
      price: Number(row.base_price),
      station: row.station,
      available: row.available,
      featured: row.featured
    }));
}

function createOptionalPublicSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function getLocalMenuCatalogResult(): MenuCatalogResult {
  return {
    ...getInitialMenuCatalog(),
    dataSource: "local"
  };
}

async function getSupabaseMenuCatalog(): Promise<MenuCatalogResult> {
  try {
    const supabase =
      resolveMenuDataSource() === "supabase"
        ? createServerSupabaseClient()
        : createOptionalPublicSupabaseClient();

    if (!supabase) {
      return getLocalMenuCatalogResult();
    }

    const [{ data: categoryRows, error: categoriesError }, { data: itemRows, error: itemsError }] =
      await Promise.all([
        supabase
          .from("menu_categories")
          .select("id, name, position")
          .eq("status", "active")
          .order("position", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("menu_items")
          .select("id, category_id, name, description, base_price, station, available, featured, status")
          .eq("status", "active")
          .order("name", { ascending: true })
      ]);

    if (categoriesError || itemsError || !categoryRows || !itemRows) {
      return getLocalMenuCatalogResult();
    }

    return {
      ...normalizeMenuCatalog({
        categories: mapCategoryRows(categoryRows as MenuCategoryRow[]),
        items: mapItemRows(itemRows as MenuItemRow[])
      }),
      dataSource: resolveMenuDataSource()
    };
  } catch {
    return getLocalMenuCatalogResult();
  }
}

export async function getMenuCatalog(): Promise<MenuCatalogResult> {
  if (resolveMenuDataSource() === "local") {
    return getLocalMenuCatalogResult();
  }

  return getSupabaseMenuCatalog();
}

async function updateMenuItemField(
  itemId: string,
  field: "available" | "featured",
  value: boolean
): Promise<{ dataSource: MenuDataSource; updated: boolean }> {
  if (resolveMenuDataSource() !== "supabase") {
    return {
      dataSource: "local",
      updated: false
    };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("menu_items").update({ [field]: value }).eq("id", itemId);

  if (error) {
    return {
      dataSource: "local",
      updated: false
    };
  }

  return {
    dataSource: "supabase",
    updated: true
  };
}

export async function updateMenuItemAvailability(itemId: string, available: boolean) {
  return updateMenuItemField(itemId, "available", available);
}

export async function updateMenuItemFeatured(itemId: string, featured: boolean) {
  return updateMenuItemField(itemId, "featured", featured);
}

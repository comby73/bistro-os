import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getInitialMenuCatalog,
  normalizeMenuCatalog
} from "./calculations";
import type {
  MenuCatalog,
  MenuCategory,
  MenuDataSource,
  MenuItem,
  MenuItemInput,
  MenuItemPatch,
  MenuMutationResult
} from "./types";

type MenuCategoryRow = {
  id: string;
  name: string;
  position: number | null;
  restaurant_id?: string;
};

type MenuItemRow = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  base_price: number | string;
  station: MenuItem["station"];
  available: boolean;
  featured: boolean;
  status: string;
  metadata?: { image_url?: string; storage_path?: string } | null;
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
      restaurant_id: row.restaurant_id,
      category_id: row.category_id as string,
      name: row.name,
      description: row.description ?? "",
      price: Number(row.base_price),
      station: row.station,
      available: row.available,
      featured: row.featured,
      image_url: row.metadata?.image_url,
      status: row.status === "archived" ? "archived" : "active"
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
          .select("id, restaurant_id, category_id, name, description, base_price, station, available, featured, status, metadata")
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

// Catálogo local filtrado a un restaurante: items del restaurante + solo
// las categorías que tienen al menos un item (evita tabs vacíos).
function getLocalMenuCatalogForRestaurant(restaurantId: string): MenuCatalogResult {
  const base = getInitialMenuCatalog();
  const items = base.items.filter((item) => item.restaurant_id === restaurantId);
  const usedCategoryIds = new Set(items.map((item) => item.category_id));
  const categories = base.categories.filter((category) => usedCategoryIds.has(category.id));

  return { categories, items, dataSource: "local" };
}

async function getSupabaseMenuCatalogForRestaurant(
  restaurantId: string
): Promise<MenuCatalogResult> {
  try {
    const supabase =
      resolveMenuDataSource() === "supabase"
        ? createServerSupabaseClient()
        : createOptionalPublicSupabaseClient();

    if (!supabase) {
      return getLocalMenuCatalogForRestaurant(restaurantId);
    }

    const [{ data: categoryRows, error: categoriesError }, { data: itemRows, error: itemsError }] =
      await Promise.all([
        supabase
          .from("menu_categories")
          .select("id, name, position, restaurant_id")
          .eq("status", "active")
          .eq("restaurant_id", restaurantId)
          .order("position", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("menu_items")
          .select("id, restaurant_id, category_id, name, description, base_price, station, available, featured, status, metadata")
          .eq("status", "active")
          .eq("restaurant_id", restaurantId)
          .order("name", { ascending: true })
      ]);

    if (categoriesError || itemsError || !categoryRows || !itemRows) {
      return getLocalMenuCatalogForRestaurant(restaurantId);
    }

    const items = mapItemRows(itemRows as MenuItemRow[]);
    const usedCategoryIds = new Set(items.map((item) => item.category_id));
    const categories = mapCategoryRows(categoryRows as MenuCategoryRow[]).filter((category) =>
      usedCategoryIds.has(category.id)
    );

    return {
      ...normalizeMenuCatalog({ categories, items }),
      dataSource: resolveMenuDataSource()
    };
  } catch {
    return getLocalMenuCatalogForRestaurant(restaurantId);
  }
}

// Fuente única por restaurante — usada por /menu interno y /carta pública.
export async function getMenuCatalogForRestaurant(
  restaurantId: string
): Promise<MenuCatalogResult> {
  if (resolveMenuDataSource() === "local") {
    return getLocalMenuCatalogForRestaurant(restaurantId);
  }

  return getSupabaseMenuCatalogForRestaurant(restaurantId);
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

// ── CRUD completo de productos (escritura a Supabase) ────────────────────────

const LOCAL_RESULT: MenuMutationResult = { dataSource: "local", updated: false };

// image_url y storage_path se persisten en metadata mientras la columna real
// no exista en la DB viva (ver supabase/schema.sql para la promoción a columna).
function buildItemPayload(
  input: MenuItemInput,
  restaurantId: string,
  branchId: string | null
) {
  return {
    restaurant_id: restaurantId,
    branch_id: branchId,
    category_id: input.category_id,
    name: input.name,
    description: input.description,
    base_price: input.price,
    station: input.station,
    available: input.available,
    featured: input.featured,
    status: "active",
    metadata: {
      source: "app",
      ...(input.image_url ? { image_url: input.image_url } : {})
    }
  };
}

export async function createMenuItem(
  input: MenuItemInput,
  restaurantId: string,
  branchId: string | null
): Promise<MenuMutationResult> {
  if (resolveMenuDataSource() !== "supabase") return LOCAL_RESULT;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .insert(buildItemPayload(input, restaurantId, branchId))
    .select("id")
    .single();

  if (error || !data) return LOCAL_RESULT;
  return { dataSource: "supabase", updated: true, itemId: data.id };
}

// Verifica que el item pertenezca al restaurante activo (aislamiento por tenant).
async function assertItemOwnership(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  itemId: string,
  restaurantId: string
): Promise<{ metadata: Record<string, unknown> } | null> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("restaurant_id, metadata")
    .eq("id", itemId)
    .single();

  if (error || !data || data.restaurant_id !== restaurantId) return null;
  return { metadata: (data.metadata as Record<string, unknown>) ?? {} };
}

export async function updateMenuItem(
  itemId: string,
  patch: MenuItemPatch,
  restaurantId: string
): Promise<MenuMutationResult> {
  if (resolveMenuDataSource() !== "supabase") return LOCAL_RESULT;

  const supabase = createServerSupabaseClient();
  const owned = await assertItemOwnership(supabase, itemId, restaurantId);
  if (!owned) return LOCAL_RESULT;

  const payload: Record<string, unknown> = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.price !== undefined) payload.base_price = patch.price;
  if (patch.category_id !== undefined) payload.category_id = patch.category_id;
  if (patch.station !== undefined) payload.station = patch.station;
  if (patch.available !== undefined) payload.available = patch.available;
  if (patch.featured !== undefined) payload.featured = patch.featured;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.image_url !== undefined) {
    payload.metadata = { ...owned.metadata, image_url: patch.image_url };
  }

  const { error } = await supabase.from("menu_items").update(payload).eq("id", itemId);
  if (error) return LOCAL_RESULT;
  return { dataSource: "supabase", updated: true, itemId };
}

export async function archiveMenuItem(
  itemId: string,
  restaurantId: string
): Promise<MenuMutationResult> {
  return updateMenuItem(itemId, { status: "archived", available: false }, restaurantId);
}

// Persiste la imagen subida (URL pública + storage_path) en metadata del item.
export async function setMenuItemImage(
  itemId: string,
  restaurantId: string,
  imageUrl: string,
  storagePath: string
): Promise<MenuMutationResult> {
  if (resolveMenuDataSource() !== "supabase") return LOCAL_RESULT;

  const supabase = createServerSupabaseClient();
  const owned = await assertItemOwnership(supabase, itemId, restaurantId);
  if (!owned) return LOCAL_RESULT;

  const { error } = await supabase
    .from("menu_items")
    .update({ metadata: { ...owned.metadata, image_url: imageUrl, storage_path: storagePath } })
    .eq("id", itemId);

  if (error) return LOCAL_RESULT;
  return { dataSource: "supabase", updated: true, itemId };
}

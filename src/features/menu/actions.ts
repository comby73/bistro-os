"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import {
  archiveMenuItem,
  createMenuItem,
  setMenuItemImage,
  updateMenuItem,
  updateMenuItemAvailability as updateMenuItemAvailabilityInRepository,
  updateMenuItemFeatured as updateMenuItemFeaturedInRepository
} from "./repository";
import type { MenuItemInput, MenuItemPatch, MenuMutationResult } from "./types";

const BUCKET = "menu-images";
const LOCAL: MenuMutationResult = { dataSource: "local", updated: false };

// Roles autorizados a administrar la carta. chef → roadmap (hoy lo cubre admin).
const MENU_EDITORS = new Set(["owner", "admin"]);

type MenuSession = { restaurantId: string; branchId: string | null };

// Resuelve sesión + permisos desde cookies (server-side, no confía en el cliente).
async function requireMenuEditor(): Promise<MenuSession | null> {
  const cookieStore = await cookies();
  const role = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  if (!role || !MENU_EDITORS.has(role)) return null;

  const session = getActiveRestaurantSession(cookieStore);
  if (!session?.restaurantId) return null;

  return { restaurantId: session.restaurantId, branchId: session.branchId };
}

// ── Toggles existentes (disponibilidad / destacado) ──────────────────────────

export async function updateMenuItemAvailabilityAction(itemId: string, available: boolean) {
  const session = await requireMenuEditor();
  if (!session) return LOCAL;
  const result = await updateMenuItemAvailabilityInRepository(itemId, available);
  if (result.updated) revalidatePath("/menu");
  return result;
}

export async function updateMenuItemFeaturedAction(itemId: string, featured: boolean) {
  const session = await requireMenuEditor();
  if (!session) return LOCAL;
  const result = await updateMenuItemFeaturedInRepository(itemId, featured);
  if (result.updated) revalidatePath("/menu");
  return result;
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export async function createMenuItemAction(input: MenuItemInput): Promise<MenuMutationResult> {
  const session = await requireMenuEditor();
  if (!session) return LOCAL;

  const result = await createMenuItem(input, session.restaurantId, session.branchId);
  if (result.updated) revalidatePath("/menu");
  return result;
}

export async function updateMenuItemAction(
  itemId: string,
  patch: MenuItemPatch
): Promise<MenuMutationResult> {
  const session = await requireMenuEditor();
  if (!session) return LOCAL;

  const result = await updateMenuItem(itemId, patch, session.restaurantId);
  if (result.updated) revalidatePath("/menu");
  return result;
}

export async function archiveMenuItemAction(itemId: string): Promise<MenuMutationResult> {
  const session = await requireMenuEditor();
  if (!session) return LOCAL;

  const result = await archiveMenuItem(itemId, session.restaurantId);
  if (result.updated) revalidatePath("/menu");
  return result;
}

// ── Upload de imagen a Supabase Storage (bucket menu-images) ──────────────────

export async function uploadMenuImageAction(
  formData: FormData
): Promise<{ url?: string; path?: string; error?: string }> {
  const session = await requireMenuEditor();
  if (!session) return { error: "No autorizado." };

  const file = formData.get("file");
  const itemId = formData.get("itemId")?.toString();
  if (!(file instanceof File) || file.size === 0) return { error: "Archivo inválido." };
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen." };
  if (file.size > 5 * 1024 * 1024) return { error: "La imagen supera 5MB." };

  const supabase = createServerSupabaseClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeItem = itemId || `tmp-${Date.now()}`;
  // ruta: restaurants/{restaurant_id}/menu/{item_id}/{timestamp}.{ext}
  const path = `restaurants/${session.restaurantId}/menu/${safeItem}/${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) return { error: `Error al subir: ${uploadError.message}` };

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;

  // Si la imagen es de un item existente, persistimos la URL en su metadata.
  if (itemId) {
    await setMenuItemImage(itemId, session.restaurantId, url, path);
    revalidatePath("/menu");
  }

  return { url, path };
}

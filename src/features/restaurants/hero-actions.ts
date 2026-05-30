"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getActiveRestaurantSession } from "./session";

const BUCKET = "restaurant-images";
const EDITORS = new Set(["owner", "admin"]);

// Solo owner/admin del restaurante activo. Devuelve el restaurant_id de sesión.
async function requireRestaurantEditor(): Promise<string | null> {
  const cookieStore = await cookies();
  const role = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  if (!role || !EDITORS.has(role)) return null;
  const session = getActiveRestaurantSession(cookieStore);
  return session?.restaurantId ?? null;
}

async function readHeroImages(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  restaurantId: string
): Promise<{ metadata: Record<string, unknown>; hero: string[] }> {
  const { data } = await supabase
    .from("restaurants")
    .select("metadata")
    .eq("id", restaurantId)
    .single();
  const metadata = (data?.metadata as Record<string, unknown>) ?? {};
  const hero = Array.isArray(metadata.hero_images) ? (metadata.hero_images as string[]) : [];
  return { metadata, hero };
}

export async function uploadRestaurantHeroAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const restaurantId = await requireRestaurantEditor();
  if (!restaurantId) return { error: "No autorizado." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Archivo inválido." };
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen." };
  if (file.size > 5 * 1024 * 1024) return { error: "La imagen supera 5MB." };

  const supabase = createServerSupabaseClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `restaurants/${restaurantId}/hero/${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { error: `Error al subir: ${upErr.message}` };

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;

  const { metadata, hero } = await readHeroImages(supabase, restaurantId);
  await supabase
    .from("restaurants")
    .update({ metadata: { ...metadata, hero_images: [...hero, url] } })
    .eq("id", restaurantId);

  revalidatePath("/dashboard");
  return { url };
}

export async function removeRestaurantHeroAction(
  url: string
): Promise<{ ok?: boolean; error?: string }> {
  const restaurantId = await requireRestaurantEditor();
  if (!restaurantId) return { error: "No autorizado." };

  const supabase = createServerSupabaseClient();
  const { metadata, hero } = await readHeroImages(supabase, restaurantId);
  const nextHero = hero.filter((u) => u !== url);

  await supabase
    .from("restaurants")
    .update({ metadata: { ...metadata, hero_images: nextHero } })
    .eq("id", restaurantId);

  // Borrar el archivo del Storage si pertenece a este restaurante.
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    if (path.startsWith(`restaurants/${restaurantId}/`)) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

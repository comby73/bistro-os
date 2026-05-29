"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PROFILE_COOKIE } from "./session";

export type RestaurantActionState = { error?: string; success?: string };

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const BRAND_COLORS = [
  "#E8B863", "#4A9B7F", "#C0732A", "#7C6BC9",
  "#C95F7C", "#4A8FC0", "#7CAF4A", "#C97B4A",
];

export async function createRestaurantAction(
  _prev: RestaurantActionState,
  formData: FormData
): Promise<RestaurantActionState> {
  const name       = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const brandColor = formData.get("brandColor")?.toString().trim() || BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
  const branchName = formData.get("branchName")?.toString().trim() ?? "";
  const address    = formData.get("address")?.toString().trim() ?? "";

  if (!name || !branchName || !address) {
    return { error: "Nombre del restaurante, sucursal y dirección son obligatorios." };
  }

  const cookieStore = await cookies();
  const profileId   = cookieStore.get(PROFILE_COOKIE)?.value;
  if (!profileId) return { error: "No se encontró la sesión activa." };

  const sb   = createServerSupabaseClient();
  const slug = toSlug(name);

  // 1. Crear restaurante
  const { data: rest, error: re } = await sb.from("restaurants").insert({
    name,
    legal_name: name,
    email: "",
    phone: "",
    city: "Buenos Aires",
    country: "Argentina",
    plan: "Pro",
    status: "active",
    metadata: { slug, description, brand_color: brandColor, source: "app" },
  }).select("id").single();

  if (re || !rest) return { error: `Error al crear restaurante: ${re?.message}` };

  // 2. Crear sucursal principal
  const { data: branch, error: be } = await sb.from("branches").insert({
    restaurant_id: rest.id,
    name: branchName,
    address,
    city: "Buenos Aires",
    timezone: "America/Argentina/Buenos_Aires",
    status: "active",
    metadata: { source: "app" },
  }).select("id").single();

  if (be || !branch) return { error: `Error al crear sucursal: ${be?.message}` };

  // 3. Asignar al dueño en role_assignments
  await sb.from("role_assignments").insert({
    restaurant_id: rest.id,
    branch_id: branch.id,
    profile_id: profileId,
    role: "owner",
    status: "active",
    metadata: { source: "app" },
  });

  revalidatePath("/restaurants");
  revalidatePath("/select-branch");
  return { success: `Restaurante "${name}" creado con sucursal "${branchName}".` };
}

export async function toggleRestaurantStatusAction(formData: FormData): Promise<void> {
  const restaurantId = formData.get("restaurantId")?.toString() ?? "";
  const newStatus    = formData.get("status")?.toString() ?? "active";
  if (!restaurantId) return;
  const sb = createServerSupabaseClient();
  await sb.from("restaurants").update({ status: newStatus }).eq("id", restaurantId);
  revalidatePath("/restaurants");
  revalidatePath("/select-branch");
}

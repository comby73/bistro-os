"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "./session";

export type BranchActionState = { error?: string; success?: string };

export async function createBranchAction(
  _prev: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  const name    = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const city    = formData.get("city")?.toString().trim() ?? "Buenos Aires";
  const phone   = formData.get("phone")?.toString().trim() ?? "";

  if (!name || !address) return { error: "Nombre y dirección son obligatorios." };

  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);
  if (!session?.restaurantId) return { error: "No se encontró el restaurante activo." };

  const sb = createServerSupabaseClient();
  const { error } = await sb.from("branches").insert({
    restaurant_id: session.restaurantId,
    name,
    address,
    city,
    phone,
    timezone: "America/Argentina/Buenos_Aires",
    status: "active",
    metadata: { source: "app" },
  });

  if (error) return { error: `Error al crear sucursal: ${error.message}` };

  revalidatePath("/branches");
  revalidatePath("/select-branch");
  return { success: `Sucursal "${name}" creada correctamente.` };
}

export async function toggleBranchStatusAction(formData: FormData): Promise<void> {
  const branchId  = formData.get("branchId")?.toString() ?? "";
  const newStatus = formData.get("status")?.toString() ?? "active";

  if (!branchId) return;

  const sb = createServerSupabaseClient();
  await sb.from("branches").update({ status: newStatus }).eq("id", branchId);

  revalidatePath("/branches");
  revalidatePath("/select-branch");
}

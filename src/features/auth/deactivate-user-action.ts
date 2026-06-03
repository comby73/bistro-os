"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "@/features/restaurants/session";

export type DeactivateUserState = {
  error?: string;
  success?: string;
};

export async function deactivateUserAction(
  _prev: DeactivateUserState,
  formData: FormData
): Promise<DeactivateUserState> {
  const profileId = formData.get("profileId")?.toString().trim() ?? "";

  if (!profileId) return { error: "ID de usuario no válido." };

  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);
  if (!session?.restaurantId) return { error: "Sin sesión activa." };

  const sb = createServerSupabaseClient();

  // Seguridad: verificar que el perfil pertenece al restaurante activo
  const { data: profile, error: fetchError } = await sb
    .from("profiles")
    .select("id, full_name, restaurant_id, metadata")
    .eq("id", profileId)
    .eq("restaurant_id", session.restaurantId)
    .single();

  if (fetchError || !profile) {
    return { error: "Usuario no encontrado en este restaurante." };
  }

  // No permitir darse de baja a uno mismo (chequeo básico)
  const meta = (profile.metadata ?? {}) as Record<string, string>;
  if (meta.demo_role === "owner") {
    return { error: "No se puede dar de baja al dueño del restaurante." };
  }

  // Baja lógica: status = 'inactive'. NO se borra el usuario ni su historial.
  const { error: updateError } = await sb
    .from("profiles")
    .update({ status: "inactive" })
    .eq("id", profileId)
    .eq("restaurant_id", session.restaurantId);

  if (updateError) {
    return { error: `Error al dar de baja: ${updateError.message}` };
  }

  revalidatePath("/users");
  return { success: `${profile.full_name} fue dado/a de baja correctamente.` };
}

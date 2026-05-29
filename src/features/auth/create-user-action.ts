"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidRoleId } from "@/features/auth/roles";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { cookies } from "next/headers";

export type CreateUserState = {
  error?: string;
  success?: string;
};

const ROLE_COLORS: Record<string, string> = {
  owner:   "#E8B863",
  admin:   "#b8966a",
  manager: "#9a7d55",
  waiter:  "#c9a165",
  kitchen: "#6b5740",
};

const ROLE_TITLES: Record<string, string> = {
  owner:   "Dueño/a",
  admin:   "Administrador/a",
  manager: "Jefe/a de sala",
  waiter:  "Mozo/a",
  kitchen: "Cocina",
};

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const email    = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const role     = formData.get("role")?.toString() ?? "";

  if (!fullName || !email || !password || !role) {
    return { error: "Completá todos los campos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (!isValidRoleId(role)) {
    return { error: "Rol inválido." };
  }

  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);
  if (!session?.restaurantId) {
    return { error: "No se encontró el restaurante activo." };
  }

  const sb = createServerSupabaseClient();

  // Verificar que el restaurant y branch existan
  const { data: branch } = await sb
    .from("branches")
    .select("id")
    .eq("restaurant_id", session.restaurantId)
    .eq("status", "active")
    .single();

  const branchId = session.branchId ?? branch?.id ?? null;

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    if (authError.message.includes("already")) {
      return { error: "Ya existe un usuario con ese email." };
    }
    return { error: `Error al crear usuario: ${authError.message}` };
  }

  const authUserId = authData.user.id;

  // Iniciales del nombre
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  // 2. Crear perfil
  const { error: profileError } = await sb.from("profiles").insert({
    auth_user_id:  authUserId,
    restaurant_id: session.restaurantId,
    branch_id:     branchId,
    full_name:     fullName,
    email,
    phone:         "",
    status:        "active",
    metadata: {
      demo_role:        role,
      avatar_color:     ROLE_COLORS[role] ?? "#E8B863",
      avatar_initials:  initials,
      title:            ROLE_TITLES[role] ?? role,
    },
  });

  if (profileError) {
    // Revertir usuario auth si falla el perfil
    await sb.auth.admin.deleteUser(authUserId);
    return { error: `Error al guardar el perfil: ${profileError.message}` };
  }

  return { success: `Usuario "${fullName}" creado correctamente.` };
}

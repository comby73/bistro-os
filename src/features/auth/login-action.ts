"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_ROLE_COOKIE } from "@/features/auth/demo-session";
import { getDefaultRouteForRole, isValidRoleId } from "@/features/auth/roles";
import {
  BRANCH_COOKIE,
  PROFILE_COOKIE,
  PROFILE_NAME_COOKIE,
  RESTAURANT_COOKIE,
} from "@/features/restaurants/session";

const COOKIE_OPTIONS = {
  path: "/",
  // Sin maxAge → cookie de sesión: muere al cerrar el navegador.
  // Cada inicio fresco de la app vuelve a pedir login (no queda "guardada").
  sameSite: "lax" as const,
  httpOnly: true,
};

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) return { error: "Ingresá tu email y contraseña." };

  // 1. Verificar credenciales (anon key — flujo de usuario)
  const { createClient } = await import("@supabase/supabase-js");
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({ email, password });
  if (authError || !authData.user) return { error: "Email o contraseña incorrectos." };

  const authUserId = authData.user.id;
  const sb = createServerSupabaseClient();

  // 2. Perfil del usuario
  const { data: profile, error: profileError } = await sb
    .from("profiles")
    .select("id, full_name, restaurant_id, branch_id, metadata")
    .eq("auth_user_id", authUserId)
    .eq("status", "active")
    .single();

  if (profileError || !profile) return { error: "No se encontró un perfil activo para este usuario." };

  const meta = (profile.metadata ?? {}) as Record<string, string>;
  const role = meta.demo_role ?? "";
  if (!isValidRoleId(role)) return { error: "El rol de este usuario no es válido." };

  // 3. Guardar cookies base
  const cookieStore = await cookies();
  cookieStore.set(PROFILE_COOKIE,      profile.id,        COOKIE_OPTIONS);
  cookieStore.set(PROFILE_NAME_COOKIE, profile.full_name, COOKIE_OPTIONS);
  cookieStore.set(DEMO_ROLE_COOKIE,    role,              COOKIE_OPTIONS);

  // 4. Lógica de redirección según rol y cantidad de sucursales
  const canMultiSelect = role === "owner" || role === "admin";

  if (canMultiSelect) {
    // Contar todos los restaurantes accesibles via role_assignments
    const { data: assignments } = await sb
      .from("role_assignments")
      .select("restaurant_id, branch_id")
      .eq("profile_id", profile.id)
      .eq("status", "active");

    const restaurantIds = [...new Set((assignments ?? []).map((a) => a.restaurant_id))];
    if (!restaurantIds.includes(profile.restaurant_id)) restaurantIds.push(profile.restaurant_id);

    // Contar sucursales activas en total
    const { data: branches } = await sb
      .from("branches")
      .select("id, restaurant_id")
      .in("restaurant_id", restaurantIds)
      .eq("status", "active");

    const totalBranches = branches?.length ?? 0;

    if (totalBranches === 1 && branches) {
      // Una sola sucursal → directo al dashboard
      const only = branches[0];
      cookieStore.set(RESTAURANT_COOKIE, only.restaurant_id, COOKIE_OPTIONS);
      cookieStore.set(BRANCH_COOKIE,     only.id,            COOKIE_OPTIONS);
      redirect(getDefaultRouteForRole(role));
    } else {
      // Múltiples → selector
      cookieStore.set(RESTAURANT_COOKIE, profile.restaurant_id, COOKIE_OPTIONS);
      cookieStore.delete(BRANCH_COOKIE);
      redirect("/select-branch");
    }
  }

  // Roles operativos (manager, waiter, kitchen) → directo con su sucursal
  cookieStore.set(RESTAURANT_COOKIE, profile.restaurant_id, COOKIE_OPTIONS);
  if (profile.branch_id) cookieStore.set(BRANCH_COOKIE, profile.branch_id, COOKIE_OPTIONS);
  redirect(getDefaultRouteForRole(role));
}

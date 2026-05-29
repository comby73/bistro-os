"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_ROLE_COOKIE, } from "@/features/auth/demo-session";
import { getDefaultRouteForRole, isValidRoleId } from "@/features/auth/roles";
import { BRANCH_COOKIE, PROFILE_COOKIE, RESTAURANT_COOKIE } from "@/features/restaurants/session";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  sameSite: "lax" as const,
  httpOnly: true,
};

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }

  // 1. Verificar credenciales con anon key (flujo de usuario normal)
  const { createClient } = await import("@supabase/supabase-js");
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const authUserId = authData.user.id;

  // 2. Buscar el perfil con service role (bypass RLS)
  const sb = createServerSupabaseClient();
  const { data: profile, error: profileError } = await sb
    .from("profiles")
    .select("id, restaurant_id, branch_id, metadata")
    .eq("auth_user_id", authUserId)
    .eq("status", "active")
    .single();

  if (profileError || !profile) {
    return { error: "No se encontró un perfil activo para este usuario." };
  }

  const role = (profile.metadata as Record<string, string>)?.demo_role ?? "";

  if (!isValidRoleId(role)) {
    return { error: "El rol de este usuario no es válido." };
  }

  // 3. Setear cookies
  const cookieStore = await cookies();
  cookieStore.set(PROFILE_COOKIE,     profile.id,            COOKIE_OPTIONS);
  cookieStore.set(RESTAURANT_COOKIE,  profile.restaurant_id, COOKIE_OPTIONS);
  cookieStore.set(DEMO_ROLE_COOKIE,   role,                  COOKIE_OPTIONS);

  // Dueño y admin eligen restaurante+sucursal; el resto va directo a la suya
  const needsBranchSelect = role === "owner" || role === "admin";
  if (needsBranchSelect) {
    cookieStore.delete(BRANCH_COOKIE);
    redirect("/select-branch");
  }

  if (profile.branch_id) {
    cookieStore.set(BRANCH_COOKIE, profile.branch_id, COOKIE_OPTIONS);
  }
  redirect(getDefaultRouteForRole(role));
}

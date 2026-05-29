"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "./demo-session";
import { getDefaultRouteForRole } from "./roles";

export async function selectDemoRoleAction(formData: FormData) {
  const roleId = parseDemoRole(formData.get("roleId")?.toString());

  if (!roleId) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, roleId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax"
  });

  redirect(getDefaultRouteForRole(roleId));
}

export async function clearDemoRoleAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ROLE_COOKIE);
  redirect("/login");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ROLE_COOKIE);
  cookieStore.delete("bistro_restaurant_id");
  cookieStore.delete("bistro_branch_id");
  redirect("/login");
}

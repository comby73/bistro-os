"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BRANCH_COOKIE } from "@/features/restaurants/session";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getDefaultRouteForRole } from "@/features/auth/roles";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  sameSite: "lax" as const,
  httpOnly: true,
};

export async function selectBranchAction(formData: FormData) {
  const branchId = formData.get("branchId")?.toString();
  if (!branchId) redirect("/select-branch");

  const cookieStore = await cookies();
  cookieStore.set(BRANCH_COOKIE, branchId, COOKIE_OPTIONS);

  const role = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  redirect(role ? getDefaultRouteForRole(role) : "/dashboard");
}

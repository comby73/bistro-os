"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getDefaultRouteForRole } from "@/features/auth/roles";
import { getBranchByIdFromDb, getRestaurantByIdFromDb } from "./db";
import { getDefaultBranchForRestaurant } from "./mock-data";
import { BRANCH_COOKIE, RESTAURANT_COOKIE } from "./session";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  sameSite: "lax" as const
};

export async function selectRestaurantAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId")?.toString();
  const restaurant = await getRestaurantByIdFromDb(restaurantId);

  if (!restaurant) {
    redirect("/login");
  }

  const branchId =
    formData.get("branchId")?.toString() ??
    getDefaultBranchForRestaurant(restaurant.id)?.id;

  const cookieStore = await cookies();
  cookieStore.set(RESTAURANT_COOKIE, restaurant.id, COOKIE_OPTIONS);
  if (branchId) {
    cookieStore.set(BRANCH_COOKIE, branchId, COOKIE_OPTIONS);
  }

  redirect("/login");
}

export async function selectRestaurantRoleAction(formData: FormData) {
  const roleId = parseDemoRole(formData.get("roleId")?.toString());
  const restaurantId = formData.get("restaurantId")?.toString();
  const restaurant = await getRestaurantByIdFromDb(restaurantId);

  if (!roleId || !restaurant) {
    redirect("/login");
  }

  const branchId =
    formData.get("branchId")?.toString() ??
    getDefaultBranchForRestaurant(restaurant.id)?.id;

  const cookieStore = await cookies();
  cookieStore.set(RESTAURANT_COOKIE, restaurant.id, COOKIE_OPTIONS);
  if (branchId) {
    cookieStore.set(BRANCH_COOKIE, branchId, COOKIE_OPTIONS);
  }
  cookieStore.set(DEMO_ROLE_COOKIE, roleId, COOKIE_OPTIONS);

  redirect(getDefaultRouteForRole(roleId));
}

export async function clearRestaurantAction() {
  const cookieStore = await cookies();
  cookieStore.delete(RESTAURANT_COOKIE);
  cookieStore.delete(BRANCH_COOKIE);
  redirect("/login");
}

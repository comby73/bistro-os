import type { RestaurantSession } from "./types";

export const RESTAURANT_COOKIE = "bistro_restaurant_id";
export const BRANCH_COOKIE     = "bistro_branch_id";
export const PROFILE_COOKIE    = "bistro_profile_id";

interface CookieReader {
  get(name: string): { value: string } | undefined;
}

/**
 * Lee la sesión activa de restaurante desde las cookies.
 * branchId puede ser null cuando owner/admin todavía no eligió sucursal.
 */
export function getActiveRestaurantSession(
  cookieStore: CookieReader
): (RestaurantSession & { branchId: string | null }) | null {
  const restaurantId = cookieStore.get(RESTAURANT_COOKIE)?.value;
  if (!restaurantId) return null;

  const branchId = cookieStore.get(BRANCH_COOKIE)?.value ?? null;

  return { restaurantId, branchId };
}

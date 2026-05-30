/**
 * Server-side Supabase queries for the restaurant / auth layer.
 * All functions are async and run on the server only.
 * Falls back to mock-data when Supabase is unavailable.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Branch, DemoUser, Restaurant } from "./types";
import {
  demoBranches,
  demoRestaurants,
  demoUsers,
} from "./mock-data";

// ── helpers ──────────────────────────────────────────────────────────────────

type DbRestaurant = {
  id: string;
  name: string;
  metadata: (Record<string, string> & { hero_images?: string[] }) | null;
};

type DbBranch = {
  id: string;
  restaurant_id: string;
  name: string;
  address: string;
};

type DbProfile = {
  id: string;
  restaurant_id: string;
  branch_id: string | null;
  full_name: string;
  metadata: Record<string, string> | null;
};

function mapRestaurant(row: DbRestaurant): Restaurant {
  const meta = row.metadata ?? {};
  return {
    id: row.id,
    name: row.name,
    slug: meta.slug ?? row.id,
    description: meta.description ?? "",
    brand_color: meta.brand_color ?? "#E8B863",
    hero_images: Array.isArray(meta.hero_images) ? meta.hero_images : undefined,
  };
}

function mapBranch(row: DbBranch): Branch {
  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    name: row.name,
    address: row.address,
  };
}

function mapProfile(row: DbProfile): DemoUser {
  const meta = row.metadata ?? {};
  const initials =
    meta.avatar_initials ??
    row.full_name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return {
    id: row.id,
    name: row.full_name,
    title: meta.title ?? meta.demo_role ?? "",
    role_id: meta.demo_role ?? "waiter",
    restaurant_id: row.restaurant_id,
    avatar_color: meta.avatar_color ?? "#E8B863",
    avatar_initials: initials,
  };
}

// ── public API ────────────────────────────────────────────────────────────────

/**
 * All active restaurants + their first branch.
 * Falls back to mock data on error.
 */
export async function getRestaurantsWithBranches(): Promise<
  { restaurant: Restaurant; branch: Branch | null }[]
> {
  try {
    const sb = createServerSupabaseClient();

    const [{ data: restRows, error: re }, { data: branchRows, error: be }] =
      await Promise.all([
        sb
          .from("restaurants")
          .select("id, name, metadata")
          .eq("status", "active")
          .order("name"),
        sb
          .from("branches")
          .select("id, restaurant_id, name, address")
          .eq("status", "active"),
      ]);

    if (re || be || !restRows?.length) throw new Error("Supabase query failed");

    const restaurants = restRows.map(mapRestaurant);
    const branches = (branchRows ?? []).map(mapBranch);

    return restaurants.map((r) => ({
      restaurant: r,
      branch: branches.find((b) => b.restaurant_id === r.id) ?? null,
    }));
  } catch {
    // fallback to mock data
    return demoRestaurants.map((r) => ({
      restaurant: r,
      branch: demoBranches.find((b) => b.restaurant_id === r.id) ?? null,
    }));
  }
}

/**
 * One restaurant by id. Falls back to mock.
 */
export async function getRestaurantByIdFromDb(
  restaurantId: string | null | undefined
): Promise<Restaurant | null> {
  if (!restaurantId) return null;
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from("restaurants")
      .select("id, name, metadata")
      .eq("id", restaurantId)
      .single();
    if (error || !data) throw new Error();
    return mapRestaurant(data);
  } catch {
    return demoRestaurants.find((r) => r.id === restaurantId) ?? null;
  }
}

/**
 * First branch for a restaurant. Falls back to mock.
 */
export async function getBranchByIdFromDb(
  branchId: string | null | undefined
): Promise<Branch | null> {
  if (!branchId) return null;
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from("branches")
      .select("id, restaurant_id, name, address")
      .eq("id", branchId)
      .single();
    if (error || !data) throw new Error();
    return mapBranch(data);
  } catch {
    return demoBranches.find((b) => b.id === branchId) ?? null;
  }
}

/**
 * All demo users (profiles) for a restaurant. Falls back to mock.
 */
export async function getDemoUsersForRestaurantFromDb(
  restaurantId: string
): Promise<DemoUser[]> {
  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from("profiles")
      .select("id, restaurant_id, branch_id, full_name, metadata")
      .eq("restaurant_id", restaurantId)
      .eq("status", "active")
      .order("full_name");
    if (error || !data?.length) throw new Error();
    return data.map(mapProfile);
  } catch {
    return demoUsers.filter((u) => u.restaurant_id === restaurantId);
  }
}

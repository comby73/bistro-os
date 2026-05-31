import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { FinanceDashboard, type FinanceRestaurantView } from "@/components/finance/FinanceDashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PROFILE_COOKIE } from "@/features/restaurants/session";
import { getFinanceData } from "@/features/finance/mock-data";

type RestaurantRow = {
  id: string;
  name: string;
  metadata: Record<string, string> | null;
};

type BranchRow = {
  id: string;
  restaurant_id: string;
  name: string;
};

export default async function FinancesPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get(PROFILE_COOKIE)?.value ?? "";
  const supabase = createServerSupabaseClient();

  const { data: assignments } = await supabase
    .from("role_assignments")
    .select("restaurant_id")
    .eq("profile_id", profileId)
    .eq("status", "active");

  const restaurantIds = [...new Set((assignments ?? []).map((assignment) => assignment.restaurant_id))];

  const [{ data: restaurants }, { data: branches }] = restaurantIds.length
    ? await Promise.all([
        supabase
          .from("restaurants")
          .select("id, name, metadata")
          .in("id", restaurantIds)
          .eq("status", "active")
          .order("name"),
        supabase
          .from("branches")
          .select("id, restaurant_id, name")
          .in("restaurant_id", restaurantIds)
          .eq("status", "active")
      ])
    : [{ data: [] }, { data: [] }];

  const branchRows = (branches ?? []) as BranchRow[];
  const financeRestaurants: FinanceRestaurantView[] = ((restaurants ?? []) as RestaurantRow[]).map(
    (restaurant) => {
      const metadata = restaurant.metadata ?? {};
      return {
        id: restaurant.id,
        name: restaurant.name,
        color: metadata.brand_color ?? "#E8B863",
        branchNames: branchRows
          .filter((branch) => branch.restaurant_id === restaurant.id)
          .map((branch) => branch.name),
        finance: getFinanceData(restaurant.id)
      };
    }
  );

  return (
    <AppShell currentPath="/finances">
      <FinanceDashboard restaurants={financeRestaurants} />
    </AppShell>
  );
}

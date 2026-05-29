import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { getRestaurantByIdFromDb } from "@/features/restaurants/db";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;
  const restaurantSession = getActiveRestaurantSession(cookieStore);
  const restaurant = await getRestaurantByIdFromDb(restaurantSession?.restaurantId);

  return (
    <AppShell currentPath="/dashboard">
      {roleId && role ? (
        <DashboardWorkspace
          roleId={roleId}
          roleLabel={role.label}
          restaurantId={restaurantSession?.restaurantId}
          restaurantName={restaurant?.name}
          restaurantSlug={restaurant?.slug}
        />
      ) : (
        <section className="space-y-6">
          <div>
            <p className="eyebrow mb-3">Dashboard</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Vista interna del sistema.
            </h2>
          </div>
          <div className="card-premium p-6 text-sm text-paper/60">
            Esta vista requiere seleccionar un rol demo desde el login.
          </div>
        </section>
      )}
    </AppShell>
  );
}

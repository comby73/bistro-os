import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { MenuWorkspace } from "@/components/menu/MenuWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import {
  updateMenuItemAvailabilityAction,
  updateMenuItemFeaturedAction
} from "@/features/menu/actions";
import { getMenuCatalog, getMenuCatalogForRestaurant } from "@/features/menu/repository";
import { getRoleConfig } from "@/features/auth/roles";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { getRestaurantByIdFromDb } from "@/features/restaurants/db";

export default async function MenuPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const restaurantSession = getActiveRestaurantSession(cookieStore);
  const role = roleId ? getRoleConfig(roleId) : null;

  // Catálogo filtrado por restaurante activo (mismo origen que /carta).
  // Sin restaurante en sesión cae al catálogo completo.
  const restaurantId = restaurantSession?.restaurantId;
  const [menuCatalog, restaurant] = await Promise.all([
    restaurantId ? getMenuCatalogForRestaurant(restaurantId) : getMenuCatalog(),
    getRestaurantByIdFromDb(restaurantId),
  ]);

  const initialCatalog =
    menuCatalog.dataSource === "supabase"
      ? { categories: menuCatalog.categories, items: menuCatalog.items }
      : undefined;

  return (
    <AppShell currentPath="/menu">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Menú</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {roleId === "waiter" ? "Carta rápida del turno." : "Menú operativo."}
          </h2>
        </div>

        {roleId && role ? (
          <MenuWorkspace
            roleId={roleId}
            initialCatalog={initialCatalog}
            dataSource={menuCatalog.dataSource}
            persistAvailability={updateMenuItemAvailabilityAction}
            persistFeatured={updateMenuItemFeaturedAction}
            restaurantId={restaurantSession?.restaurantId}
            restaurantSlug={restaurant?.slug}
          />
        ) : (
          <div className="card-premium p-6 text-sm text-paper/60">
            Seleccioná un rol demo para consultar el menú operativo.
          </div>
        )}
      </section>
    </AppShell>
  );
}

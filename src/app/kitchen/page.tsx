import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { KitchenBoard } from "@/components/kitchen/KitchenBoard";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getActiveRestaurantSession } from "@/features/restaurants/session";

export default async function KitchenPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const restaurantSession = getActiveRestaurantSession(cookieStore);

  return (
    <AppShell currentPath="/kitchen">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">KDS</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Tablero de cocina.
          </h2>
        </div>

        {roleId ? (
          <KitchenBoard roleId={roleId} restaurantId={restaurantSession?.restaurantId} />
        ) : (
          <div className="card-premium p-6 text-sm text-paper/60">
            Seleccioná un rol demo para entrar al KDS.
          </div>
        )}
      </section>
    </AppShell>
  );
}

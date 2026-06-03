import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { SalesWorkspace } from "@/components/sales/SalesWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";
import { getActiveRestaurantSession } from "@/features/restaurants/session";

export default async function SalesPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;
  const readOnly = role?.id === "manager";
  const restaurantSession = getActiveRestaurantSession(cookieStore);

  return (
    <AppShell currentPath="/sales">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Ventas y caja</p>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
              Ventas del turno.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-paper/60">
              Basado en los pedidos reales del restaurante. Los entregados se toman
              como cobrados; los abiertos como pendientes de cobro.
            </p>
          </div>
          {readOnly && (
            <div className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm text-paper/60">
              Vista solo lectura para Jefe de sala.
            </div>
          )}
        </div>

        <SalesWorkspace
          readOnly={readOnly}
          restaurantId={restaurantSession?.restaurantId}
        />
      </section>
    </AppShell>
  );
}

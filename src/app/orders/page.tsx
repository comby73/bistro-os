import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { OrdersWorkspace } from "@/components/orders/OrdersWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";
import { getMenuCatalog } from "@/features/menu/repository";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;
  const menuCatalog = await getMenuCatalog();
  const initialMenuCatalog =
    menuCatalog.dataSource === "supabase"
      ? {
          categories: menuCatalog.categories,
          items: menuCatalog.items
        }
      : undefined;

  return (
    <AppShell currentPath="/orders">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Pedidos</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {roleId === "waiter" ? "Tomar pedido." : "Pedidos activos."}
          </h2>
        </div>

        {roleId && role ? (
          <OrdersWorkspace
            roleId={roleId}
            roleLabel={role.label}
            initialMenuCatalog={initialMenuCatalog}
          />
        ) : (
          <div className="card-premium p-6 text-sm text-paper/60">
            Seleccioná un rol demo para operar pedidos.
          </div>
        )}
      </section>
    </AppShell>
  );
}

import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { MenuWorkspace } from "@/components/menu/MenuWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRoleConfig } from "@/features/auth/roles";

export default async function MenuPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const role = roleId ? getRoleConfig(roleId) : null;

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
          <MenuWorkspace roleId={roleId} />
        ) : (
          <div className="card-premium p-6 text-sm text-paper/60">
            Seleccioná un rol demo para consultar el menú operativo.
          </div>
        )}
      </section>
    </AppShell>
  );
}

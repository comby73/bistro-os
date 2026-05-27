import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DemoSessionControls } from "@/components/auth/DemoSessionControls";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import {
  getDefaultRouteForRole,
  getRoleConfig,
  isRouteAllowed,
  type AppRoute
} from "@/features/auth/roles";

interface AppShellProps {
  currentPath: AppRoute;
  children: React.ReactNode;
}

export async function AppShell({ currentPath, children }: AppShellProps) {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);

  if (!roleId) {
    redirect("/login");
  }

  const role = getRoleConfig(roleId);
  const isAllowed = isRouteAllowed(roleId, currentPath);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-line bg-layer1/50 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-6">
            <Link href={getDefaultRouteForRole(roleId)} className="inline-flex items-center">
              <BrandLogo size="sm" />
            </Link>

            <div className="mt-8 rounded-3xl border border-line bg-ink/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold/80">Rol activo</p>
              <p className="mt-3 text-2xl font-semibold">{role.label}</p>
              <p className="mt-2 text-sm leading-6 text-paper/58">{role.description}</p>
            </div>

            <nav className="mt-8 space-y-2">
              {role.navigation.map((item) => {
                const isActive = item.href === currentPath;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "block rounded-2xl border border-gold/35 bg-gold/10 px-4 py-3 text-sm font-medium text-gold"
                        : "block rounded-2xl border border-transparent px-4 py-3 text-sm text-paper/70 transition hover:border-line hover:bg-layer1/70 hover:text-paper"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <DemoSessionControls />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-line bg-ink/80 px-6 py-5 backdrop-blur-xl md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-2">Sistema interno</p>
                <h1 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                  {role.label} en operación
                </h1>
              </div>
              <div className="text-sm text-paper/55">
                Navegación visible según permisos del rol demo actual.
              </div>
            </div>
          </header>

          <main className="px-6 py-8 md:px-8">
            {isAllowed ? (
              children
            ) : (
              <section className="card-premium max-w-2xl p-8">
                <p className="eyebrow mb-4">Acceso no permitido</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                  Esta pantalla no está disponible para {role.label}.
                </h2>
                <p className="mt-4 text-sm leading-7 text-paper/60">
                  El rol activo tiene una navegación más acotada para representar el
                  trabajo real dentro del restaurante.
                </p>
                <div className="mt-8">
                  <Link href={getDefaultRouteForRole(roleId)} className="btn-gold">
                    Volver a su pantalla principal
                  </Link>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

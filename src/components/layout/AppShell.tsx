import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  ChefHat,
  BookOpen,
  Users,
  MapPin,
  Store,
  BarChart3,
  ChevronsUpDown,
  Globe,
  UtensilsCrossed,
  CalendarPlus,
} from "lucide-react";
import { DemoSessionControls } from "@/components/auth/DemoSessionControls";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SupabaseStatus } from "@/components/layout/SupabaseStatus";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import {
  getDefaultRouteForRole,
  getRoleConfig,
  isRouteAllowed,
  type AppRoute
} from "@/features/auth/roles";
import {
  getActiveRestaurantSession,
  PROFILE_NAME_COOKIE,
} from "@/features/restaurants/session";
import { getBranchByIdFromDb, getRestaurantByIdFromDb } from "@/features/restaurants/db";

const NAV_ICONS: Record<string, React.ElementType> = {
  "/dashboard":    LayoutDashboard,
  "/sales":        TrendingUp,
  "/orders":       ClipboardList,
  "/reservations": CalendarDays,
  "/kitchen":      ChefHat,
  "/menu":         BookOpen,
  "/users":        Users,
  "/branches":     MapPin,
  "/restaurants":  Store,
  "/finances":     BarChart3,
};

const NAV_GROUPS: { label: string; routes: AppRoute[] }[] = [
  { label: "General", routes: ["/dashboard"] },
  { label: "Operación", routes: ["/orders", "/reservations", "/kitchen", "/menu"] },
  { label: "Caja y análisis", routes: ["/sales", "/finances"] },
  { label: "Administración", routes: ["/users", "/branches", "/restaurants"] },
];

interface AppShellProps {
  currentPath?: AppRoute;
  children: React.ReactNode;
}

export async function AppShell({ currentPath, children }: AppShellProps) {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);

  if (!roleId) redirect("/login");

  const role = getRoleConfig(roleId);
  const isAllowed = currentPath ? isRouteAllowed(roleId, currentPath) : true;
  const canSwitchBranch = roleId === "owner" || roleId === "admin";
  const profileName = cookieStore.get(PROFILE_NAME_COOKIE)?.value ?? "";

  const restaurantSession = getActiveRestaurantSession(cookieStore);

  // Si owner/admin no eligió sucursal todavía, mandarlo al selector
  if (canSwitchBranch && !restaurantSession?.branchId) {
    redirect("/select-branch");
  }

  const [restaurant, branch] = await Promise.all([
    getRestaurantByIdFromDb(restaurantSession?.restaurantId),
    getBranchByIdFromDb(restaurantSession?.branchId),
  ]);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-line bg-layer1/50 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-6">
            <Link href={getDefaultRouteForRole(roleId)} className="inline-flex items-center">
              <BrandLogo size="sm" />
            </Link>

            {/* Restaurante + sucursal */}
            {restaurant && (
              <div className="mt-6 rounded-2xl border border-line bg-layer1/50 p-4">
                <p
                  className="text-lg font-semibold leading-tight"
                  style={{ color: restaurant.brand_color }}
                >
                  {restaurant.name}
                </p>
                {branch && (
                  <p className="mt-1 text-xs text-paper/50">{branch.name} · {branch.address}</p>
                )}

                {/* Switcher para owner/admin */}
                {canSwitchBranch && (
                  <Link
                    href="/select-branch"
                    className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/50 transition hover:text-gold"
                  >
                    <ChevronsUpDown size={12} />
                    Cambiar sucursal
                  </Link>
                )}
              </div>
            )}

            {/* Usuario + Rol activo */}
            <div className="mt-6 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/8 via-ink/60 to-ink/90 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/90">Sesión activa</p>
              {profileName && (
                <p className="mt-2 text-[17px] font-bold text-paper leading-tight">{profileName}</p>
              )}
              <p className={`${profileName ? "mt-0.5" : "mt-2.5"} text-[13px] font-semibold text-gold/80`}>{role.label}</p>
              <p className="mt-2 text-[13px] leading-6 text-paper/65">{role.description}</p>
            </div>

            {/* Navegación */}
            <nav className="mt-8 space-y-6">
              {NAV_GROUPS.map((group) => {
                const items = role.navigation.filter((item) => group.routes.includes(item.href));
                if (items.length === 0) return null;

                return (
                  <div key={group.label}>
                    <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/35">
                      {group.label}
                    </p>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const isActive = item.href === currentPath;
                        const Icon = NAV_ICONS[item.href] ?? LayoutDashboard;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={
                              isActive
                                ? "flex items-center gap-3 rounded-2xl border border-gold/35 bg-gold/10 px-4 py-3.5 text-[15px] font-semibold text-gold"
                                : "flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3.5 text-[15px] font-medium text-paper/75 transition-all duration-200 hover:border-line hover:bg-layer1/70 hover:text-paper"
                            }
                          >
                            <Icon size={18} className={isActive ? "text-gold" : "opacity-60"} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Sitio público del restaurante */}
            {restaurant?.slug && (
              <div className="mt-6 rounded-2xl border border-line bg-layer1/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Globe size={13} className="text-paper/40" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/40">
                    Sitio público
                  </p>
                </div>
                <div className="space-y-1">
                  <Link
                    href={`/reservar/${restaurant.slug}`}
                    target="_blank"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-paper/70 transition-all hover:bg-layer2 hover:text-paper"
                  >
                    <CalendarPlus size={15} className="opacity-60" />
                    Página de reservas
                  </Link>
                  <Link
                    href={`/carta/${restaurant.slug}`}
                    target="_blank"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-paper/70 transition-all hover:bg-layer2 hover:text-paper"
                  >
                    <UtensilsCrossed size={15} className="opacity-60" />
                    Ver carta pública
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3 pt-8">
              <SupabaseStatus />
              <DemoSessionControls />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-line bg-ink/80 px-6 py-5 backdrop-blur-xl md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-2">
                  {branch ? `${branch.name}` : "Sistema interno"}
                </p>
                <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
                  {role.label} en operación
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-start gap-1 md:items-end">
                  <p className="text-[15px] font-medium capitalize text-paper/85">
                    {new Intl.DateTimeFormat("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }).format(new Date())}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-paper/45">
                    Bistró OS · Demo
                  </p>
                </div>
                <LogoutButton variant="header" />
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

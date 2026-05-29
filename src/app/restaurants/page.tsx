import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { CreateRestaurantForm } from "@/components/restaurants/CreateRestaurantForm";
import { toggleRestaurantStatusAction } from "@/features/restaurants/restaurant-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PROFILE_COOKIE } from "@/features/restaurants/session";
import { Store, CheckCircle, XCircle } from "lucide-react";

export default async function RestaurantsPage() {
  const cookieStore = await cookies();
  const profileId   = cookieStore.get(PROFILE_COOKIE)?.value ?? "";

  const sb = createServerSupabaseClient();

  // Todos los restaurantes del dueño via role_assignments
  const { data: assignments } = await sb
    .from("role_assignments")
    .select("restaurant_id, role")
    .eq("profile_id", profileId)
    .eq("status", "active");

  const restaurantIds = [...new Set((assignments ?? []).map((a) => a.restaurant_id))];

  const { data: restaurants } = restaurantIds.length
    ? await sb
        .from("restaurants")
        .select("id, name, status, metadata")
        .in("id", restaurantIds)
        .order("name")
    : { data: [] };

  // Contar sucursales por restaurante
  const { data: branches } = restaurantIds.length
    ? await sb
        .from("branches")
        .select("id, restaurant_id, status")
        .in("restaurant_id", restaurantIds)
    : { data: [] };

  const branchCount = (restId: string) =>
    (branches ?? []).filter((b) => b.restaurant_id === restId && b.status === "active").length;

  const active   = (restaurants ?? []).filter((r) => r.status === "active");
  const inactive = (restaurants ?? []).filter((r) => r.status !== "active");

  return (
    <AppShell currentPath="/restaurants">
      <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">

        <div>
          <p className="eyebrow mb-2">Administración</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Mis restaurantes
          </h1>
          <p className="mt-2 text-[15px] text-paper/60">
            Todos los restaurantes asignados a tu cuenta. Podés crear nuevos o desactivar existentes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Lista */}
          <div className="space-y-6">

            <div>
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/45">
                Activos · {active.length}
              </p>
              <div className="space-y-3">
                {active.map((r) => {
                  const meta  = (r.metadata ?? {}) as Record<string, string>;
                  const color = meta.brand_color ?? "#E8B863";
                  return (
                    <div key={r.id}
                      className="flex items-center gap-4 rounded-2xl border border-line bg-layer1/60 px-5 py-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[16px] font-bold"
                        style={{ backgroundColor: `${color}25`, color }}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-bold text-paper">{r.name}</p>
                        <p className="text-[13px] text-paper/50">
                          {branchCount(r.id)} sucursal{branchCount(r.id) !== 1 ? "es" : ""} activa{branchCount(r.id) !== 1 ? "s" : ""}
                          {meta.description ? ` · ${meta.description}` : ""}
                        </p>
                      </div>
                      <form action={toggleRestaurantStatusAction}>
                        <input type="hidden" name="restaurantId" value={r.id} />
                        <input type="hidden" name="status"       value="inactive" />
                        <button type="submit"
                          className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-[12px] font-medium text-paper/50 transition hover:border-red-500/40 hover:text-red-400">
                          <XCircle size={13} />
                          Desactivar
                        </button>
                      </form>
                    </div>
                  );
                })}
                {active.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-12 text-center">
                    <Store size={28} className="text-paper/25" />
                    <p className="text-[14px] text-paper/45">No tenés restaurantes activos.</p>
                  </div>
                )}
              </div>
            </div>

            {inactive.length > 0 && (
              <div>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/30">
                  Inactivos · {inactive.length}
                </p>
                <div className="space-y-3 opacity-60">
                  {inactive.map((r) => {
                    const meta  = (r.metadata ?? {}) as Record<string, string>;
                    const color = meta.brand_color ?? "#E8B863";
                    return (
                      <div key={r.id}
                        className="flex items-center gap-4 rounded-2xl border border-line/40 bg-layer1/30 px-5 py-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[16px] font-bold opacity-50"
                          style={{ backgroundColor: `${color}15`, color }}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-paper/60">{r.name}</p>
                        </div>
                        <form action={toggleRestaurantStatusAction}>
                          <input type="hidden" name="restaurantId" value={r.id} />
                          <input type="hidden" name="status"       value="active" />
                          <button type="submit"
                            className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-[12px] font-medium text-paper/50 transition hover:border-green-500/40 hover:text-green-400">
                            <CheckCircle size={13} />
                            Reactivar
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-line bg-layer1/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
                <Store size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-paper">Nuevo restaurante</p>
                <p className="text-[12px] text-paper/50">Con su primera sucursal</p>
              </div>
            </div>
            <CreateRestaurantForm />
          </div>

        </div>
      </div>
    </AppShell>
  );
}

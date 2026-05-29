import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { PROFILE_COOKIE } from "@/features/restaurants/session";
import { selectBranchAction } from "./actions";
import { MapPin } from "lucide-react";

type RestaurantGroup = {
  id: string;
  name: string;
  brand_color: string;
  branches: { id: string; name: string; address: string }[];
};

export default async function SelectBranchPage() {
  const cookieStore = await cookies();
  const session  = getActiveRestaurantSession(cookieStore);
  const role     = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const profileId = cookieStore.get(PROFILE_COOKIE)?.value;

  if (!session?.restaurantId || !role) redirect("/login");
  if (role !== "owner" && role !== "admin") redirect("/dashboard");

  const sb = createServerSupabaseClient();

  // Todos los restaurantes a los que tiene acceso via role_assignments
  const { data: assignments } = await sb
    .from("role_assignments")
    .select("restaurant_id, branch_id")
    .eq("profile_id", profileId ?? "")
    .eq("status", "active");

  const restaurantIds = [...new Set((assignments ?? []).map((a) => a.restaurant_id))];

  // Si solo hay uno, usamos el del perfil también
  if (!restaurantIds.includes(session.restaurantId)) {
    restaurantIds.unshift(session.restaurantId);
  }

  // Traer restaurantes y sucursales en paralelo
  const [{ data: restaurants }, { data: branches }] = await Promise.all([
    sb.from("restaurants")
      .select("id, name, metadata")
      .in("id", restaurantIds)
      .eq("status", "active"),
    sb.from("branches")
      .select("id, restaurant_id, name, address")
      .in("restaurant_id", restaurantIds)
      .eq("status", "active")
      .order("name"),
  ]);

  // Agrupar sucursales por restaurante
  const groups: RestaurantGroup[] = (restaurants ?? []).map((r) => {
    const meta = (r.metadata ?? {}) as Record<string, string>;
    return {
      id: r.id,
      name: r.name,
      brand_color: meta.brand_color ?? "#E8B863",
      branches: (branches ?? []).filter((b) => b.restaurant_id === r.id),
    };
  });

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20 pb-10">
        <section className="mx-6 w-full max-w-xl">

          <div className="mb-6">
            <p className="eyebrow mb-2">Selección de sucursal</p>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
              ¿Desde dónde operás?
            </h1>
            <p className="mt-2 text-[15px] text-paper/60">
              Elegí el restaurante y la sucursal para esta sesión.
            </p>
          </div>

          <div className="space-y-5">
            {groups.map((rest) => (
              <div
                key={rest.id}
                className="overflow-hidden rounded-3xl border bg-layer1/50"
                style={{ borderColor: `${rest.brand_color}30` }}
              >
                {/* Header restaurante */}
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{ background: `linear-gradient(90deg, ${rest.brand_color}18 0%, transparent 100%)` }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[14px] font-bold"
                    style={{ backgroundColor: `${rest.brand_color}25`, color: rest.brand_color }}
                  >
                    {rest.name.charAt(0)}
                  </span>
                  <p className="text-[16px] font-bold" style={{ color: rest.brand_color }}>
                    {rest.name}
                  </p>
                  <span className="ml-auto text-[11px] text-paper/35">
                    {rest.branches.length} sucursal{rest.branches.length !== 1 ? "es" : ""}
                  </span>
                </div>

                {/* Sucursales */}
                <div className="divide-y divide-line/40 px-4 pb-4 pt-2 space-y-2">
                  {rest.branches.map((branch) => (
                    <form key={branch.id} action={selectBranchAction}>
                      <input type="hidden" name="branchId"     value={branch.id} />
                      <input type="hidden" name="restaurantId" value={rest.id} />
                      <button
                        type="submit"
                        className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-line hover:bg-layer1"
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${rest.brand_color}18`, color: rest.brand_color }}
                        >
                          <MapPin size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-paper">{branch.name}</p>
                          <p className="text-[13px] text-paper/50">{branch.address}</p>
                        </div>
                        <span className="text-[13px] text-paper/30 transition group-hover:text-gold">
                          Entrar →
                        </span>
                      </button>
                    </form>
                  ))}
                  {rest.branches.length === 0 && (
                    <p className="py-3 text-center text-[13px] text-paper/35">
                      Sin sucursales activas
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}

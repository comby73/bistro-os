import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getRestaurantByIdFromDb } from "@/features/restaurants/db";
import { selectBranchAction } from "./actions";
import { MapPin } from "lucide-react";

export default async function SelectBranchPage() {
  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);
  const role = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);

  if (!session?.restaurantId || !role) redirect("/login");
  if (role !== "owner" && role !== "admin") redirect("/dashboard");

  const [restaurant, branches] = await Promise.all([
    getRestaurantByIdFromDb(session.restaurantId),
    createServerSupabaseClient()
      .from("branches")
      .select("id, name, address")
      .eq("restaurant_id", session.restaurantId)
      .eq("status", "active")
      .order("name"),
  ]);

  const branchList = branches.data ?? [];
  const color = restaurant?.brand_color ?? "#E8B863";

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20 pb-10">
        <section className="mx-6 w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-layer1/60">

          {/* Header con color del restaurante */}
          <div
            className="relative flex items-end p-8 pb-6"
            style={{ background: `linear-gradient(135deg, ${color}22 0%, transparent 60%)` }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 70%)` }}
            />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/50">
                Selección de sucursal
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
                ¿Desde dónde<br />operás?
              </h1>
              {restaurant && (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold"
                    style={{ backgroundColor: `${color}30`, color }}
                  >
                    {restaurant.name.charAt(0)}
                  </span>
                  <p className="text-[15px] font-semibold" style={{ color }}>
                    {restaurant.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lista de sucursales */}
          <div className="p-6 pt-2 space-y-3">
            {branchList.map((branch) => (
              <form key={branch.id} action={selectBranchAction}>
                <input type="hidden" name="branchId" value={branch.id} />
                <button
                  type="submit"
                  className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-layer1/40 px-5 py-4 text-left transition hover:border-gold/40 hover:bg-layer1"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-paper">{branch.name}</p>
                    <p className="text-[13px] text-paper/55">{branch.address}</p>
                  </div>
                  <span className="text-[13px] font-medium text-paper/35 transition group-hover:text-gold">
                    Entrar →
                  </span>
                </button>
              </form>
            ))}

            {branchList.length === 0 && (
              <p className="py-8 text-center text-[14px] text-paper/45">
                No hay sucursales activas para este restaurante.
              </p>
            )}
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}

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

  // Si no hay restaurante en cookie → volver al login
  if (!session?.restaurantId || !role) redirect("/login");

  // Solo owner y admin llegan aquí
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

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20">
        <section className="card-premium mx-6 w-full max-w-xl p-8 md:p-10">

          <p className="eyebrow mb-4">Selección de sucursal</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            ¿Desde dónde operás?
          </h1>

          {restaurant && (
            <p className="mt-2 text-[15px] text-paper/60">
              <span style={{ color: restaurant.brand_color }}>{restaurant.name}</span>
              {" · "}elegí la sucursal para esta sesión.
            </p>
          )}

          <div className="mt-8 grid gap-3">
            {branchList.map((branch) => (
              <form key={branch.id} action={selectBranchAction}>
                <input type="hidden" name="branchId" value={branch.id} />
                <button
                  type="submit"
                  className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-layer1/60 px-5 py-4 text-left transition hover:border-gold/40 hover:bg-layer1"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: restaurant ? `${restaurant.brand_color}20` : "#E8B86320",
                      color: restaurant?.brand_color ?? "#E8B863",
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-paper">{branch.name}</p>
                    <p className="text-[13px] text-paper/55">{branch.address}</p>
                  </div>
                  <span className="text-[13px] text-paper/35 transition group-hover:text-gold">
                    Entrar →
                  </span>
                </button>
              </form>
            ))}

            {branchList.length === 0 && (
              <p className="text-center text-[14px] text-paper/45">
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

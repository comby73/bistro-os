import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PROFILE_COOKIE } from "@/features/restaurants/session";
import { demoReservations } from "@/features/restaurants/mock-data";
import { TrendingUp, Store, MapPin } from "lucide-react";

// En demo usamos reservas del mock para simular recaudación
// Precio promedio por reserva según cantidad de personas
const AVG_TICKET_PER_PERSON = 28; // USD

function calcRevenue(restaurantId: string) {
  const reservas = demoReservations.filter(
    (r) => r.restaurant_id === restaurantId && r.status !== "pending"
  );
  const personas  = reservas.reduce((s, r) => s + r.party_size, 0);
  const subtotal  = personas * AVG_TICKET_PER_PERSON;
  const count     = reservas.length;
  return { subtotal, count, personas };
}

export default async function FinancesPage() {
  const cookieStore = await cookies();
  const profileId   = cookieStore.get(PROFILE_COOKIE)?.value ?? "";

  const sb = createServerSupabaseClient();

  const { data: assignments } = await sb
    .from("role_assignments")
    .select("restaurant_id")
    .eq("profile_id", profileId)
    .eq("status", "active");

  const restaurantIds = [...new Set((assignments ?? []).map((a) => a.restaurant_id))];

  const { data: restaurants } = restaurantIds.length
    ? await sb
        .from("restaurants")
        .select("id, name, metadata")
        .in("id", restaurantIds)
        .eq("status", "active")
        .order("name")
    : { data: [] };

  const { data: branches } = restaurantIds.length
    ? await sb
        .from("branches")
        .select("id, restaurant_id, name")
        .in("restaurant_id", restaurantIds)
        .eq("status", "active")
    : { data: [] };

  const items = (restaurants ?? []).map((r) => {
    const meta    = (r.metadata ?? {}) as Record<string, string>;
    const color   = meta.brand_color ?? "#E8B863";
    const revenue = calcRevenue(r.id);
    const restBranches = (branches ?? []).filter((b) => b.restaurant_id === r.id);
    return { ...r, color, revenue, branches: restBranches };
  });

  const totalRevenue  = items.reduce((s, i) => s + i.revenue.subtotal, 0);
  const totalPersonas = items.reduce((s, i) => s + i.revenue.personas, 0);
  const totalReservas = items.reduce((s, i) => s + i.revenue.count, 0);

  return (
    <AppShell currentPath="/finances">
      <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">

        <div>
          <p className="eyebrow mb-2">Consolidado</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Finanzas
          </h1>
          <p className="mt-2 text-[15px] text-paper/60">
            Recaudación estimada por restaurante y totales consolidados. Datos demo basados en reservas.
          </p>
        </div>

        {/* Totales consolidados */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Recaudación total", value: `USD ${totalRevenue.toLocaleString()}`, hint: "Suma de todos los restaurantes" },
            { label: "Reservas completadas", value: String(totalReservas), hint: "Turno actual · todos los locales" },
            { label: "Personas atendidas", value: String(totalPersonas), hint: "Estimado sobre reservas confirmadas" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold/70">{m.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-paper">{m.value}</p>
              <p className="mt-1 text-[13px] text-paper/50">{m.hint}</p>
            </div>
          ))}
        </div>

        {/* Por restaurante */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/45">
            Desglose por restaurante
          </p>
          <div className="space-y-4">
            {items.map((r) => {
              const pct = totalRevenue > 0 ? Math.round((r.revenue.subtotal / totalRevenue) * 100) : 0;
              return (
                <div key={r.id} className="rounded-2xl border border-line bg-layer1/60 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold"
                        style={{ backgroundColor: `${r.color}25`, color: r.color }}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-paper">{r.name}</p>
                        <div className="mt-0.5 flex flex-wrap gap-3 text-[12px] text-paper/50">
                          <span className="flex items-center gap-1">
                            <Store size={11} /> {r.branches.length} sucursal{r.branches.length !== 1 ? "es" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {r.revenue.count} reservas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tracking-[-0.03em]" style={{ color: r.color }}>
                        USD {r.revenue.subtotal.toLocaleString()}
                      </p>
                      <p className="text-[12px] text-paper/45">{pct}% del total</p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-layer2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: r.color }}
                    />
                  </div>

                  {/* Sucursales */}
                  {r.branches.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.branches.map((b) => (
                        <span key={b.id}
                          className="rounded-full border border-line/50 px-3 py-1 text-[11px] text-paper/50">
                          {b.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-16 text-center">
            <TrendingUp size={32} className="text-paper/25" />
            <p className="text-[15px] text-paper/45">No hay restaurantes asignados a tu cuenta.</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}

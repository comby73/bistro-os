import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { CreateBranchForm } from "@/components/branches/CreateBranchForm";
import { toggleBranchStatusAction } from "@/features/restaurants/branch-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { MapPin, CheckCircle, XCircle, Building2 } from "lucide-react";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

export default async function BranchesPage() {
  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);

  const sb = createServerSupabaseClient();

  // Todas las sucursales del restaurante (activas e inactivas)
  const { data: branches } = session?.restaurantId
    ? await sb
        .from("branches")
        .select("id, name, address, city, phone, status")
        .eq("restaurant_id", session.restaurantId)
        .order("name")
    : { data: [] };

  const active   = branches?.filter((b) => b.status === "active")   ?? [];
  const inactive = branches?.filter((b) => b.status !== "active")   ?? [];

  return (
    <AppShell currentPath="/branches">
      <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">

        {/* Header */}
        <div>
          <p className="eyebrow mb-2">Administración</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Sucursales
          </h1>
          <p className="mt-2 text-[15px] text-paper/60">
            Gestioná las sucursales de tu restaurante. Todo se guarda en Supabase en tiempo real.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Lista */}
          <div className="space-y-6">

            {/* Activas */}
            <div>
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/45">
                Activas · {active.length}
              </p>
              <div className="space-y-3">
                {active.map((b) => (
                  <div key={b.id}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-layer1/60 px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                      <MapPin size={18} className="text-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-paper">{b.name}</p>
                      <p className="text-[13px] text-paper/50">{b.address}{b.city ? ` · ${b.city}` : ""}</p>
                      {b.phone && <p className="text-[12px] text-paper/40">{b.phone}</p>}
                    </div>
                    <form action={toggleBranchStatusAction}>
                      <input type="hidden" name="branchId" value={b.id} />
                      <input type="hidden" name="status"   value="inactive" />
                      <ConfirmSubmit
                        title="Desactivar sucursal"
                        message={`¿Seguro que querés desactivar "${b.name}"? Dejará de aparecer en el selector de sucursales. Podés reactivarla después.`}
                        confirmLabel="Sí, desactivar"
                        className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-[12px] font-medium text-paper/50 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        <XCircle size={13} />
                        Desactivar
                      </ConfirmSubmit>
                    </form>
                  </div>
                ))}
                {active.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-10 text-center">
                    <Building2 size={28} className="text-paper/25" />
                    <p className="text-[14px] text-paper/45">No hay sucursales activas.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inactivas */}
            {inactive.length > 0 && (
              <div>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/30">
                  Inactivas · {inactive.length}
                </p>
                <div className="space-y-3">
                  {inactive.map((b) => (
                    <div key={b.id}
                      className="flex items-center gap-4 rounded-2xl border border-line/40 bg-layer1/30 px-5 py-4 opacity-60">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-layer2">
                        <MapPin size={18} className="text-paper/30" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-paper/60">{b.name}</p>
                        <p className="text-[13px] text-paper/40">{b.address}</p>
                      </div>
                      <form action={toggleBranchStatusAction}>
                        <input type="hidden" name="branchId" value={b.id} />
                        <input type="hidden" name="status"   value="active" />
                        <button type="submit"
                          className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-[12px] font-medium text-paper/50 transition hover:border-green-500/40 hover:text-green-400">
                          <CheckCircle size={13} />
                          Reactivar
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulario nueva sucursal */}
          <div className="rounded-3xl border border-line bg-layer1/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
                <MapPin size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-paper">Nueva sucursal</p>
                <p className="text-[12px] text-paper/50">Se activa inmediatamente</p>
              </div>
            </div>
            <CreateBranchForm />
          </div>

        </div>
      </div>
    </AppShell>
  );
}

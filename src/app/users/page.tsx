import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveRestaurantSession } from "@/features/restaurants/session";
import { Users, Shield } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  owner:   "Dueño/a",
  admin:   "Administrador/a",
  manager: "Jefe/a de sala",
  waiter:  "Mozo/a",
  kitchen: "Cocina",
};

const ROLE_COLORS: Record<string, string> = {
  owner:   "#E8B863",
  admin:   "#b8966a",
  manager: "#9a7d55",
  waiter:  "#c9a165",
  kitchen: "#6b5740",
};

export default async function UsersPage() {
  const cookieStore = await cookies();
  const session = getActiveRestaurantSession(cookieStore);

  // Traer usuarios del restaurante activo
  const sb = createServerSupabaseClient();
  const { data: profiles } = session?.restaurantId
    ? await sb
        .from("profiles")
        .select("id, full_name, email, metadata")
        .eq("restaurant_id", session.restaurantId)
        .eq("status", "active")
        .order("full_name")
    : { data: [] };

  return (
    <AppShell currentPath="/users">
      <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">

        {/* Header */}
        <div>
          <p className="eyebrow mb-2">Administración</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Usuarios
          </h1>
          <p className="mt-2 text-[15px] text-paper/60">
            Gestioná el equipo de tu restaurante. Solo el dueño puede crear y ver usuarios.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Lista de usuarios */}
          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/45">
              Equipo actual · {profiles?.length ?? 0} usuarios
            </p>
            {profiles?.map((p) => {
              const meta = (p.metadata ?? {}) as Record<string, string>;
              const role = meta.demo_role ?? "waiter";
              const color = meta.avatar_color ?? ROLE_COLORS[role] ?? "#E8B863";
              const initials = meta.avatar_initials ?? p.full_name.slice(0, 2).toUpperCase();
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-layer1/60 px-5 py-4"
                >
                  {/* Avatar */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
                    style={{ backgroundColor: `${color}28`, color }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-paper">{p.full_name}</p>
                    <p className="text-[13px] text-paper/50">{p.email}</p>
                  </div>

                  {/* Badge rol */}
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {ROLE_LABELS[role] ?? role}
                  </span>
                </div>
              );
            })}

            {(!profiles || profiles.length === 0) && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-12 text-center">
                <Users size={28} className="text-paper/25" />
                <p className="text-[14px] text-paper/45">No hay usuarios todavía.</p>
              </div>
            )}
          </div>

          {/* Formulario nuevo usuario */}
          <div className="rounded-3xl border border-line bg-layer1/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
                <Shield size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-paper">Nuevo usuario</p>
                <p className="text-[12px] text-paper/50">Acceso inmediato al sistema</p>
              </div>
            </div>
            <CreateUserForm />
          </div>

        </div>
      </div>
    </AppShell>
  );
}

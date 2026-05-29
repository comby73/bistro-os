import {
  clearRestaurantAction,
  selectRestaurantRoleAction
} from "@/features/restaurants/actions";
import type { Branch, DemoUser, Restaurant } from "@/features/restaurants/types";
import type { RoleId } from "@/features/auth/roles";

interface RoleLoginClientProps {
  initialRoleId: RoleId | null;
  restaurant: Restaurant;
  branch: Branch | null;
  users: DemoUser[];
}

export function RoleLoginClient({ initialRoleId, restaurant, branch, users }: RoleLoginClientProps) {

  return (
    <section className="card-premium mx-6 w-full max-w-5xl p-8 md:p-10">
      <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr]">

        {/* ── columna izquierda ── */}
        <div>
          <p className="eyebrow mb-4">Acceso demo · Paso 2 de 2</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            ¿Quién sos?
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-paper/65">
            Elegí tu usuario para entrar al sistema con las pantallas y permisos de tu rol.
          </p>

          {/* restaurante activo */}
          <div className="mt-8 rounded-2xl border p-5" style={{ borderColor: `${restaurant.brand_color}40` }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45">
              Restaurante
            </p>
            <p className="mt-2 text-[18px] font-bold" style={{ color: restaurant.brand_color }}>
              {restaurant.name}
            </p>
            {branch && (
              <p className="mt-1 text-[13px] text-paper/55">{branch.name} · {branch.address}</p>
            )}
            <form action={clearRestaurantAction} className="mt-4">
              <button
                type="submit"
                className="text-[12px] font-medium uppercase tracking-[0.14em] text-paper/50 underline-offset-4 transition hover:text-gold hover:underline"
              >
                Cambiar restaurante
              </button>
            </form>
          </div>

          {/* rol activo (si ya eligió) */}
          {initialRoleId && (
            <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
                Sesión activa
              </p>
              <p className="mt-1.5 text-[15px] font-semibold text-paper">
                {users.find((u) => u.role_id === initialRoleId)?.name ?? initialRoleId}
              </p>
            </div>
          )}
        </div>

        {/* ── columna derecha: cards de usuarios ── */}
        <div className="grid gap-3 sm:grid-cols-2">
          {users.map((user) => (
            <form key={user.id} action={selectRestaurantRoleAction}>
              <input type="hidden" name="roleId"        value={user.role_id} />
              <input type="hidden" name="restaurantId"  value={restaurant.id} />
              {branch && <input type="hidden" name="branchId" value={branch.id} />}
              <button
                type="submit"
                className={`group w-full rounded-3xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  initialRoleId === user.role_id
                    ? "border-gold/40 bg-gold/8 shadow-gold/10"
                    : "border-line bg-layer1/60 hover:border-gold/30 hover:bg-layer1"
                }`}
              >
                {/* avatar */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-[14px] font-bold"
                  style={{
                    backgroundColor: `${user.avatar_color}28`,
                    color: user.avatar_color
                  }}
                >
                  {user.avatar_initials}
                </div>

                {/* nombre y título */}
                <p className="mt-3 text-[16px] font-bold text-paper">{user.name}</p>
                <p className="mt-0.5 text-[13px] text-paper/60">{user.title}</p>

                {/* badge de rol */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: `${user.avatar_color}20`,
                      color: user.avatar_color
                    }}
                  >
                    {user.role_id}
                  </span>
                  <span className="text-[12px] font-medium text-paper/40 transition group-hover:text-gold">
                    Entrar →
                  </span>
                </div>
              </button>
            </form>
          ))}
        </div>

      </div>
    </section>
  );
}

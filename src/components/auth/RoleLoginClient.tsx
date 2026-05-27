import {
  getRoleConfig,
  roleList,
  type RoleId
} from "@/features/auth/roles";
import { selectDemoRoleAction } from "@/features/auth/actions";

interface RoleLoginClientProps {
  initialRoleId: RoleId | null;
}

export function RoleLoginClient({ initialRoleId }: RoleLoginClientProps) {
  const activeRoleConfig = initialRoleId ? getRoleConfig(initialRoleId) : null;

  return (
    <section className="card-premium mx-6 w-full max-w-5xl p-8 md:p-10">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow mb-4">Acceso demo</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            Entrar al sistema operativo interno.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-paper/60">
            Elegí un rol de trabajo para recorrer la aplicación con navegación y
            pantallas adaptadas al contexto operativo de cada perfil.
          </p>
          <div className="mt-8 rounded-2xl border border-line bg-layer1/60 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-gold/80">
              Rol activo
            </p>
            <p className="mt-3 text-lg font-semibold text-paper">
              {activeRoleConfig?.label ?? "Ninguno"}
            </p>
            <p className="mt-2 text-sm leading-6 text-paper/58">
              {activeRoleConfig?.description ??
                "La selección se guarda en una cookie demo simple, sin autenticación real."}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {roleList.map((role) => (
            <form key={role.id} action={selectDemoRoleAction}>
              <input type="hidden" name="roleId" value={role.id} />
              <button
                type="submit"
                className="w-full rounded-3xl border border-line bg-layer1/70 p-5 text-left transition hover:border-gold/50 hover:bg-layer1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-paper">{role.label}</p>
                    <p className="mt-2 text-sm leading-6 text-paper/60">{role.description}</p>
                  </div>
                  <span className="rounded-full border border-gold/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">
                    {role.id}
                  </span>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-paper/45">
                  Entrar como {role.label}
                </p>
              </button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}

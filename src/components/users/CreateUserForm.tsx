"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "@/features/auth/create-user-action";
import { UserPlus } from "lucide-react";

const initialState: CreateUserState = {};

const ROLES = [
  { value: "admin",   label: "Administrador/a" },
  { value: "manager", label: "Jefe/a de sala" },
  { value: "waiter",  label: "Mozo/a" },
  { value: "kitchen", label: "Cocina" },
];

export function CreateUserForm({ onCreated }: { onCreated?: () => void }) {
  const [state, action, pending] = useActionState(
    async (prev: CreateUserState, fd: FormData) => {
      const result = await createUserAction(prev, fd);
      if (result.success && onCreated) onCreated();
      return result;
    },
    initialState
  );

  return (
    <form action={action} className="grid gap-4">

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Nombre completo
        </label>
        <input
          name="fullName"
          type="text"
          required
          placeholder="María González"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="maria@restaurante.com"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
        />
      </div>

      {/* Contraseña */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          required
          placeholder="Mínimo 6 caracteres"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
        />
      </div>

      {/* Rol */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Rol
        </label>
        <select
          name="role"
          required
          defaultValue=""
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper outline-none transition focus:border-gold/50 focus:bg-layer1"
        >
          <option value="" disabled>Elegí un rol…</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Error / Success */}
      {state.error && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-[14px] text-green-400">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold flex items-center justify-center gap-2 py-3 text-[15px] disabled:opacity-50"
      >
        <UserPlus size={16} />
        {pending ? "Creando usuario…" : "Crear usuario"}
      </button>
    </form>
  );
}

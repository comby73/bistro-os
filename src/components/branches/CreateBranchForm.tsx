"use client";

import { useActionState } from "react";
import { createBranchAction, type BranchActionState } from "@/features/restaurants/branch-actions";
import { MapPin } from "lucide-react";

const initial: BranchActionState = {};

export function CreateBranchForm() {
  const [state, action, pending] = useActionState(createBranchAction, initial);

  return (
    <form action={action} className="grid gap-4">

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Nombre de la sucursal
        </label>
        <input name="name" type="text" required placeholder="Ej: Palermo Hollywood"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Dirección
        </label>
        <input name="address" type="text" required placeholder="Ej: Honduras 5500, Palermo"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
            Ciudad
          </label>
          <input name="city" type="text" placeholder="Buenos Aires" defaultValue="Buenos Aires"
            className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
            Teléfono
          </label>
          <input name="phone" type="text" placeholder="+54 11 5555 0000"
            className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
        </div>
      </div>

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

      <button type="submit" disabled={pending}
        className="btn-gold flex items-center justify-center gap-2 py-3 text-[15px] disabled:opacity-50">
        <MapPin size={16} />
        {pending ? "Creando sucursal…" : "Agregar sucursal"}
      </button>
    </form>
  );
}

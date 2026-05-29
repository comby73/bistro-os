"use client";

import { useActionState } from "react";
import { createRestaurantAction, type RestaurantActionState } from "@/features/restaurants/restaurant-actions";
import { Store } from "lucide-react";

const initial: RestaurantActionState = {};

const COLORS = [
  { value: "#E8B863", label: "Dorado" },
  { value: "#4A9B7F", label: "Verde" },
  { value: "#C0732A", label: "Terracota" },
  { value: "#7C6BC9", label: "Violeta" },
  { value: "#C95F7C", label: "Rosa" },
  { value: "#4A8FC0", label: "Azul" },
];

export function CreateRestaurantForm() {
  const [state, action, pending] = useActionState(createRestaurantAction, initial);

  return (
    <form action={action} className="grid gap-4">

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Nombre del restaurante
        </label>
        <input name="name" type="text" required placeholder="Ej: La Cantina del Puerto"
          className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Descripción breve
        </label>
        <textarea name="description" rows={2} placeholder="Estilo del restaurante, especialidad..."
          className="resize-none rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
          Color de marca
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <label key={c.value} className="cursor-pointer">
              <input type="radio" name="brandColor" value={c.value} className="sr-only"
                defaultChecked={c.value === "#E8B863"} />
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-ink transition has-[:checked]:ring-paper"
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-line/40 pt-4">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/45">
          Primera sucursal
        </p>
        <div className="grid gap-3">
          <input name="branchName" type="text" required placeholder="Nombre de la sucursal (ej: Centro)"
            className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1" />
          <input name="address" type="text" required placeholder="Dirección completa"
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
        <Store size={16} />
        {pending ? "Creando restaurante…" : "Crear restaurante"}
      </button>
    </form>
  );
}

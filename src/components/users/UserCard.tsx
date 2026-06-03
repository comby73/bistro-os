"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserMinus, AlertTriangle } from "lucide-react";
import {
  deactivateUserAction,
  type DeactivateUserState,
} from "@/features/auth/deactivate-user-action";

interface UserCardProps {
  id: string;
  full_name: string;
  email: string;
  role: string;
  roleLabel: string;
  color: string;
  initials: string;
  isOwner: boolean;
}

const initialState: DeactivateUserState = {};

export function UserCard({
  id,
  full_name,
  email,
  role,
  roleLabel,
  color,
  initials,
  isOwner,
}: UserCardProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(deactivateUserAction, initialState);

  // Refrescar la lista cuando la baja fue exitosa
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border bg-layer1/60 px-5 py-4 transition-all ${
        confirming ? "border-red-500/40 bg-red-500/5" : "border-line"
      }`}
    >
      {/* Fila principal */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
          style={{ backgroundColor: `${color}28`, color }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-paper">{full_name}</p>
          <p className="text-[13px] text-paper/50">{email}</p>
        </div>

        {/* Badge rol */}
        <span
          className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {roleLabel}
        </span>

        {/* Botón dar de baja (no para owners) */}
        {!isOwner && !confirming && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="shrink-0 rounded-xl border border-transparent p-2 text-paper/30 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            title="Dar de baja"
          >
            <UserMinus size={15} />
          </button>
        )}
      </div>

      {/* Confirmación inline */}
      {confirming && !state.success && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
          <AlertTriangle size={15} className="shrink-0 text-red-400" />
          <p className="flex-1 text-[13px] text-red-300">
            ¿Dar de baja a <span className="font-semibold">{full_name}</span>?
            <span className="ml-1 text-red-400/70">
              (baja lógica — no se borra el historial)
            </span>
          </p>
          <form action={action} className="flex gap-2">
            <input type="hidden" name="profileId" value={id} />
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-paper/50 transition hover:text-paper"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-red-500/20 px-3 py-1.5 text-[12px] font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
            >
              {pending ? "Procesando…" : "Confirmar baja"}
            </button>
          </form>
        </div>
      )}

      {/* Error de baja */}
      {state.error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] text-red-400">
          {state.error}
        </p>
      )}
    </div>
  );
}

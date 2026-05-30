"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function LogoutButton({ variant = "sidebar" }: { variant?: "sidebar" | "header" }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const className =
    variant === "header"
      ? "flex items-center gap-2 rounded-2xl border border-line bg-layer1/60 px-4 py-2 text-[13px] font-medium text-paper/75 transition hover:border-red-500/40 hover:text-red-400"
      : "flex w-full items-center gap-2 rounded-2xl border border-line/60 px-4 py-2.5 text-[13px] font-medium text-paper/60 transition hover:border-red-500/40 hover:text-red-400";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <LogOut size={14} />
        Cerrar sesión
      </button>

      <ConfirmDialog
        open={open}
        title="Cerrar sesión"
        message="¿Seguro que querés cerrar la sesión? Vas a tener que ingresar email y contraseña de nuevo."
        confirmLabel="Sí, cerrar sesión"
        cancelLabel="Cancelar"
        tone="danger"
        pending={pending}
        onConfirm={() => startTransition(() => { void logoutAction(); })}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

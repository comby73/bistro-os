"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

// Diálogo de confirmación reutilizable (estética dark/champagne).
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  pending = false,
  onConfirm,
  onClose
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onClose]);

  if (!open) return null;

  const danger = tone === "danger";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/75 backdrop-blur-sm" onClick={() => !pending && onClose()} />

      <div className="relative w-full max-w-md rounded-3xl border border-line bg-layer1 p-7 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${danger ? "bg-red-500/12" : "bg-gold/12"}`}>
            <AlertTriangle size={20} className={danger ? "text-red-400" : "text-gold"} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold text-paper">{title}</h2>
            <p className="mt-2 text-[14px] leading-6 text-paper/65">{message}</p>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-2xl border border-line px-5 py-2.5 text-[14px] font-medium text-paper/70 transition hover:text-paper disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-[14px] font-semibold transition disabled:opacity-50 ${
              danger
                ? "border border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25"
                : "btn-gold"
            }`}
          >
            {pending && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

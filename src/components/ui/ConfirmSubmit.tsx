"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

// Botón que pide confirmación antes de enviar el <form> padre (server action).
export function ConfirmSubmit({
  children,
  className,
  title,
  message,
  confirmLabel = "Confirmar",
  tone = "danger"
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button ref={ref} type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      <ConfirmDialog
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        tone={tone}
        onConfirm={() => {
          setOpen(false);
          ref.current?.form?.requestSubmit();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

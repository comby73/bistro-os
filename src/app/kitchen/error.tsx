"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm text-paper/50 uppercase tracking-widest">Cocina</p>
      <h2 className="text-xl font-semibold text-paper/80">Algo salió mal.</h2>
      <button onClick={reset} className="btn-gold px-6 py-2 text-sm">
        Reintentar
      </button>
    </div>
  );
}

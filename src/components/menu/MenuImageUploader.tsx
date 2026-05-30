"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { uploadMenuImageAction } from "@/features/menu/actions";

export function MenuImageUploader({
  value,
  onChange,
  itemId,
  dataSource
}: {
  value?: string;
  onChange: (url: string) => void;
  itemId?: string;
  dataSource: "local" | "supabase";
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const canUpload = dataSource === "supabase";

  function handleFile(file: File) {
    setError(null);
    if (!canUpload) {
      setError("Subida disponible solo con Supabase. Pegá una URL mientras tanto.");
      return;
    }
    const fd = new FormData();
    fd.set("file", file);
    if (itemId) fd.set("itemId", itemId);
    startTransition(async () => {
      const res = await uploadMenuImageAction(fd);
      if (res.error) setError(res.error);
      else if (res.url) onChange(res.url);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
        Imagen del producto
      </span>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => canUpload && inputRef.current?.click()}
        className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border transition ${
          dragOver ? "border-gold/60 bg-gold/5" : "border-line bg-layer1/60"
        } ${canUpload ? "cursor-pointer hover:border-gold/40" : ""}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-paper/45">
            {pending ? <Loader2 size={22} className="animate-spin text-gold" /> : <ImagePlus size={22} />}
            <p className="text-[12px]">
              {pending ? "Subiendo…" : canUpload ? "Arrastrá o hacé clic" : "Pegá una URL abajo"}
            </p>
          </div>
        )}

        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 text-paper/70 transition hover:text-red-400"
            title="Quitar imagen"
          >
            <X size={14} />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Fallback / alternativa: URL directa */}
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-layer1/60 px-3">
        <Link2 size={14} className="shrink-0 text-paper/40" />
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/bistro-pri-risotto.jpg  o  https://…"
          className="w-full bg-transparent py-2.5 text-[13px] text-paper placeholder-paper/30 outline-none"
        />
      </div>

      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  );
}

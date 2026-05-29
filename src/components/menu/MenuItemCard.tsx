"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Star, Eye, EyeOff } from "lucide-react";
import type { MenuItem } from "@/features/menu/types";

function StatusBadge({ label, tone }: { label: string; tone: "gold" | "muted" | "paper" }) {
  const cls =
    tone === "gold"  ? "border-gold/30 bg-gold/10 text-gold" :
    tone === "paper" ? "border-line bg-layer1/70 text-paper/80" :
                       "border-line bg-ink/80 text-paper/50";
  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] ${cls}`}>
      {label}
    </span>
  );
}

/* Zona de imagen con drag & drop — solo para canEdit */
function ItemImage({
  itemId,
  defaultUrl,
  canEdit
}: {
  itemId: string;
  defaultUrl?: string;
  canEdit: boolean;
}) {
  const storageKey = `bistro_menu_img_${itemId}`;
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setImgSrc(saved ?? defaultUrl ?? null);
  }, [storageKey, defaultUrl]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      localStorage.setItem(storageKey, b64);
      setImgSrc(b64);
    };
    reader.readAsDataURL(file);
  }, [storageKey]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const gradient = "bg-gradient-to-br from-layer2 via-layer3 to-ink";

  if (!canEdit) {
    return (
      <div className={`relative h-36 w-full overflow-hidden rounded-2xl ${gradient}`}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Star size={18} className="text-gold/40" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative h-36 w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-200 ${gradient} ${dragOver ? "ring-2 ring-gold/60 ring-offset-1 ring-offset-ink" : "hover:ring-1 hover:ring-gold/30"}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      title="Arrastrá una imagen o hacé clic para cambiar"
    >
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      {/* overlay de edición */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200 ${dragOver ? "opacity-100" : "opacity-0 hover:opacity-100"}`}>
        <div className="rounded-full bg-ink/70 p-2.5 backdrop-blur-sm">
          <ImagePlus size={16} className="text-gold" />
        </div>
        <p className="text-[11px] font-medium text-paper/80 drop-shadow">
          {dragOver ? "Soltá la imagen" : "Cambiar imagen"}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />
    </div>
  );
}

export function MenuItemCard({
  item,
  canEdit,
  compact,
  onToggleAvailability,
  onToggleFeatured
}: {
  item: MenuItem;
  canEdit: boolean;
  compact?: boolean;
  onToggleAvailability?: (itemId: string) => void;
  onToggleFeatured?: (itemId: string) => void;
}) {
  return (
    <article className={`card-animated rounded-3xl border border-line bg-layer1/60 transition-all duration-300 hover:border-gold/20 ${compact ? "p-4" : "p-0 overflow-hidden"}`}>

      {!compact && (
        <ItemImage itemId={item.id} defaultUrl={item.image_url} canEdit={canEdit} />
      )}

      <div className={compact ? "" : "p-5"}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[19px] font-bold tracking-[-0.03em] text-paper">{item.name}</h3>
              {item.featured && <StatusBadge label="Destacado" tone="gold" />}
              <StatusBadge
                label={item.available ? "Disponible" : "No disponible"}
                tone={item.available ? "paper" : "muted"}
              />
            </div>
            <p className="mt-2 text-[15px] leading-6 text-paper/72">{item.description}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[12px] uppercase tracking-[0.13em] text-paper/55">Precio</p>
            <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-gold">USD {item.price}</p>
          </div>
        </div>

        {canEdit ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onToggleAvailability?.(item.id)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-[14px] font-medium transition-all duration-200 ${
                item.available
                  ? "border-gold/25 bg-gold/8 text-gold hover:border-gold/40 hover:bg-gold/14"
                  : "border-line bg-ink/80 text-paper/70 hover:border-gold/30 hover:text-paper"
              }`}
            >
              {item.available ? <EyeOff size={13} /> : <Eye size={13} />}
              {item.available ? "No disponible" : "Disponible"}
            </button>
            <button
              type="button"
              onClick={() => onToggleFeatured?.(item.id)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-[14px] font-medium transition-all duration-200 ${
                item.featured
                  ? "border-gold/25 bg-gold/8 text-gold hover:border-gold/40"
                  : "border-line bg-ink/80 text-paper/70 hover:border-gold/30 hover:text-paper"
              }`}
            >
              <Star size={13} />
              {item.featured ? "Quitar destacado" : "Destacar"}
            </button>
          </div>
        ) : (
          <div className="mt-4 text-[12px] uppercase tracking-[0.15em] text-paper/45">
            {compact ? "Consulta rápida de carta" : "Vista de supervisión"}
          </div>
        )}
      </div>
    </article>
  );
}

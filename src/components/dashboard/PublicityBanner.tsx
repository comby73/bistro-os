"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/carta/HeroCarousel";

const STORAGE_KEY = "bistro_publicity_banner";

export function PublicityBanner({ canEdit, defaultUrl }: { canEdit: boolean; defaultUrl?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setImgSrc(saved ?? defaultUrl ?? null);
  }, [defaultUrl]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      localStorage.setItem(STORAGE_KEY, b64);
      setImgSrc(b64);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  return (
    <section
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        canEdit
          ? dragOver
            ? "ring-2 ring-gold/60 ring-offset-1 ring-offset-ink cursor-copy"
            : "cursor-pointer hover:ring-1 hover:ring-gold/30"
          : ""
      }`}
      style={{ minHeight: "180px" }}
      onDragOver={canEdit ? (e) => { e.preventDefault(); setDragOver(true); } : undefined}
      onDragLeave={canEdit ? () => setDragOver(false) : undefined}
      onDrop={canEdit ? onDrop : undefined}
      onClick={canEdit ? () => inputRef.current?.click() : undefined}
    >
      {/* — fondo: imagen arrastrada por el dueño O carrusel de restaurant-hero — */}
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt="Publicidad del restaurante"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <HeroCarousel overlay="bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
      )}

      {/* overlay adicional solo cuando hay imagen custom */}
      {imgSrc && (
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
      )}

      {/* — contenido — */}
      <div className="relative flex min-h-[180px] items-center justify-between px-8 py-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              Bistró OS
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Cuisine & Ambiance
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-paper/70">
            Experiencias gastronómicas únicas · Reservas disponibles
          </p>
        </div>

        {/* — zona de edición (solo dueño/admin) — */}
        {canEdit && (
          <div
            className={`flex flex-col items-center gap-2 rounded-2xl border bg-ink/60 px-5 py-4 backdrop-blur-sm transition-all duration-200 ${
              dragOver ? "border-gold/60 bg-gold/10" : "border-line/60 hover:border-gold/40"
            }`}
          >
            <ImagePlus size={20} className={dragOver ? "text-gold" : "text-paper/50"} />
            <p className="text-center text-[11px] font-medium leading-4 text-paper/65">
              {dragOver ? "Soltá la imagen" : "Arrastrá o\nhacé clic"}
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />

      <style>{`
        @keyframes banner-gradient {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
      `}</style>
    </section>
  );
}

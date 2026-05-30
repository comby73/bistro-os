"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Sparkles, Pencil, X, Loader2, Trash2 } from "lucide-react";
import { HeroCarousel } from "@/components/carta/HeroCarousel";
import {
  uploadRestaurantHeroAction,
  removeRestaurantHeroAction
} from "@/features/restaurants/hero-actions";

export function PublicityBanner({
  canEdit,
  restaurantSlug,
  restaurantName,
  heroImages
}: {
  canEdit: boolean;
  restaurantSlug?: string;
  restaurantName?: string;
  heroImages?: string[];
}) {
  const [images, setImages] = useState<string[]>(heroImages ?? []);
  const [panelOpen, setPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Debe ser una imagen.");
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadRestaurantHeroAction(fd);
      if (res.error) setError(res.error);
      else if (res.url) setImages((prev) => [...prev, res.url as string]);
    });
  }

  function remove(url: string) {
    startTransition(async () => {
      const res = await removeRestaurantHeroAction(url);
      if (res.ok) setImages((prev) => prev.filter((u) => u !== url));
    });
  }

  return (
    <section className="relative overflow-hidden rounded-3xl" style={{ minHeight: "180px" }}>
      <HeroCarousel
        overlay="bg-gradient-to-r from-ink/80 via-ink/40 to-transparent"
        slug={restaurantSlug}
        images={images}
      />

      <div className="relative flex min-h-[180px] items-center justify-between px-8 py-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              Bistró OS
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            {restaurantName ?? "Cuisine & Ambiance"}
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-paper/70">
            Experiencias gastronómicas únicas · Reservas disponibles
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-line/60 bg-ink/60 px-4 py-2.5 text-[13px] font-medium text-paper/75 backdrop-blur-sm transition hover:border-gold/40 hover:text-gold"
          >
            <Pencil size={14} /> Editar imágenes
          </button>
        )}
      </div>

      {/* Panel de gestión de imágenes (owner/admin) */}
      {canEdit && panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-line bg-layer1 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-layer1/95 px-6 py-5 backdrop-blur">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
                  Imágenes de cabecera
                </p>
                <h2 className="mt-1 text-[20px] font-bold text-paper">{restaurantName}</h2>
              </div>
              <button onClick={() => setPanelOpen(false)} className="rounded-full border border-line p-2 text-paper/60 transition hover:text-paper">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <p className="text-[14px] leading-6 text-paper/60">
                Estas fotos arman el carrusel de la cabecera del dashboard y de la carta pública.
                Se guardan en Supabase y se ven al instante.
              </p>

              {/* dropzone / subir */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
                className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-layer1/60 text-paper/45 transition hover:border-gold/40"
              >
                {pending ? <Loader2 size={22} className="animate-spin text-gold" /> : <ImagePlus size={22} />}
                <p className="text-[13px]">{pending ? "Subiendo…" : "Arrastrá o hacé clic para agregar"}</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
                />
              </div>

              {error && <p className="text-[13px] text-red-400">{error}</p>}

              {/* lista de imágenes actuales */}
              <div className="grid grid-cols-2 gap-3">
                {images.map((url) => (
                  <div key={url} className="group relative overflow-hidden rounded-2xl border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => remove(url)}
                      disabled={pending}
                      className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 text-paper/70 transition hover:text-red-400"
                      title="Quitar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {images.length === 0 && (
                <p className="rounded-2xl border border-dashed border-line py-6 text-center text-[13px] text-paper/40">
                  Sin imágenes propias. Se muestran las fotos por defecto del restaurante.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

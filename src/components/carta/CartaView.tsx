"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/features/menu/types";
import { HeroCarousel } from "./HeroCarousel";

/* ─── Imagen de plato con localStorage (igual que MenuItemCard) ─── */
function DishImage({ item }: { item: MenuItem }) {
  const [src, setSrc] = useState<string | null>(item.image_url ?? null);

  useEffect(() => {
    const saved = localStorage.getItem(`bistro_menu_img_${item.id}`);
    if (saved) startTransition(() => setSrc(saved));
  }, [item.id]);

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-layer2 via-layer3 to-ink">
        <Star size={28} className="text-gold/20" />
      </div>
    );
  }

  if (src.startsWith("data:")) {
    /* base64 guardada por el dueño */
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={item.name} className="h-full w-full object-cover" />;
  }

  return (
    <Image
      src={src}
      alt={item.name}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

/* ─── Card individual de plato ─── */
function DishCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <article
      className="group relative overflow-hidden rounded-3xl bg-layer1/70 border border-line transition-all duration-500 hover:border-gold/30 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* foto */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <DishImage item={item} />
        <div className="absolute inset-0 bg-gradient-to-t from-layer1 via-layer1/20 to-transparent" />

        {/* badge destacado */}
        {item.featured && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/80 px-3 py-1 backdrop-blur-sm">
            <Star size={11} className="fill-gold text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              Destacado
            </span>
          </div>
        )}

        {/* precio sobre la imagen */}
        <div className="absolute bottom-4 right-4 rounded-2xl border border-gold/30 bg-ink/80 px-4 py-2 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.12em] text-paper/55">Precio</p>
          <p className="text-2xl font-bold leading-tight tracking-[-0.04em] text-gold">
            USD {item.price}
          </p>
        </div>
      </div>

      {/* contenido */}
      <div className="p-6">
        <h3 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-paper">
          {item.name}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.75] text-paper/72">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/* ─── Vista principal ─── */
export function CartaView({
  categories,
  items,
  restaurantName,
  restaurantSlug,
  brandColor,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
  restaurantName?: string;
  restaurantSlug?: string;
  brandColor?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const navRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category_id === activeCategory);

  const tabs = [{ id: "all", name: "Todo" }, ...categories];

  return (
    <div className="min-h-screen bg-ink text-paper">

      {/* ── HERO ── */}
      <header className="relative flex min-h-[42vh] flex-col items-center justify-end overflow-hidden pb-10 text-center">
        {/* carrusel de fotos del restaurante */}
        <HeroCarousel overlay="bg-gradient-to-b from-ink/30 via-ink/50 to-ink" slug={restaurantSlug} />

        {/* contenido hero */}
        <div className="relative z-10 px-6">
          <p
            className="mb-3 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: brandColor ?? "#E8B863" }}
          >
            {restaurantName ?? "Bistró · Cuisine & Ambiance"}
          </p>
          <h1 className="text-5xl font-bold tracking-[-0.05em] text-paper sm:text-6xl md:text-7xl">
            Nuestra Carta
          </h1>
          <p className="mt-4 text-[16px] text-paper/65">
            Ingredientes de estación · Cocina de autor
          </p>
          <div className="mt-6 flex justify-center">
            <ChevronDown size={22} className="animate-bounce text-gold/60" />
          </div>
        </div>
      </header>

      {/* ── NAVEGACIÓN DE CATEGORÍAS (sticky) ── */}
      <div
        ref={navRef}
        className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                activeCategory === tab.id
                  ? "bg-gold text-ink"
                  : "text-paper/65 hover:bg-layer2 hover:text-paper"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRILLA DE PLATOS ── */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* separador de sección si filtramos por categoría */}
        {activeCategory !== "all" && (
          <div className="mb-8">
            <p className="eyebrow mb-2">
              {categories.find((c) => c.id === activeCategory)?.name}
            </p>
            <div className="h-px bg-gradient-to-r from-gold/40 via-gold/10 to-transparent" />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <DishCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-paper/45">
            No hay platos disponibles en esta categoría.
          </p>
        )}
      </main>

      {/* ── PIE ── */}
      <footer className="border-t border-line/50 py-10 text-center">
        <p className="text-[13px] text-paper/40">
          {restaurantName ?? "Bistró · Cuisine & Ambiance"} · Carta del día
        </p>
        <p className="mt-1 text-[12px] text-paper/28">
          Precios expresados en USD · IVA incluido
        </p>
      </footer>

    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const INTERVAL_MS = 5000;
const MAX_SLIDES  = 6;

interface HeroCarouselProps {
  overlay?: string;
  className?: string;
  /** slug del restaurante, ej: "bistro-palermo". Si se omite usa las genéricas. */
  slug?: string;
  /** Imágenes administradas desde la app (Storage). Tienen prioridad sobre las de /public. */
  images?: string[];
}

export function HeroCarousel({
  overlay = "bg-gradient-to-t from-ink via-ink/50 to-ink/20",
  className = "",
  slug,
  images,
}: HeroCarouselProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  // Imágenes administradas (Storage) → prioridad. Si no hay, las propias de /public.
  const managed = useMemo(() => images ?? [], [images]);
  const ownImages = useMemo(
    () => (slug ? Array.from({ length: MAX_SLIDES }, (_, i) => `/${slug}-hero${i + 1}.jpg`) : []),
    [slug]
  );
  const genericImages = useMemo(
    () => Array.from({ length: MAX_SLIDES }, (_, i) => `/restaurant-hero${i + 1}.jpg`),
    []
  );

  /* detecta qué imágenes existen cargándolas en background */
  useEffect(() => {
    let active = true;

    // Resuelve qué subconjunto de rutas existe, en orden.
    const detect = (paths: string[]) =>
      Promise.all(
        paths.map(
          (src) =>
            new Promise<string | null>((resolve) => {
              const img = new window.Image();
              img.onload = () => resolve(src);
              img.onerror = () => resolve(null);
              img.src = src;
            })
        )
      ).then((res) => res.filter((s): s is string => s !== null));

    (async () => {
      // 0) administradas desde la app (Storage) → prioridad absoluta
      if (managed.length > 0) {
        if (active) setSlides(managed);
        return;
      }
      // 1) propias del restaurante en /public
      let found = ownImages.length ? await detect(ownImages) : [];
      // 2) si no tiene propias, caer a genéricas
      if (found.length === 0) found = await detect(genericImages);
      if (active && found.length > 0) setSlides(found);
    })();

    return () => { active = false; };
  }, [managed, ownImages, genericImages]);

  /* avanza al siguiente slide */
  const next = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setFade(true);
    }, 400);
  }, [slides.length]);

  /* auto-play */
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [next, slides.length]);

  const goTo = (i: number) => {
    if (i === current) return;
    setFade(false);
    setTimeout(() => { setCurrent(i); setFade(true); }, 400);
  };

  if (slides.length === 0) {
    /* fallback gradiente mientras cargan o si no hay imágenes */
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #2a1e08 0%, #111 60%, #0A0A0A 100%)"
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* imagen activa */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={slides[current]}
        src={slides[current]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 600ms ease-in-out"
        }}
      />

      {/* overlay */}
      <div className={`absolute inset-0 ${overlay}`} />

      {/* puntos de navegación — solo si hay más de 1 imagen */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Imagen ${i + 1}`}
              className="group relative h-2 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 28 : 8 }}
            >
              <span className="absolute inset-0 rounded-full bg-paper/30" />
              {i === current && (
                <span
                  className="absolute inset-0 rounded-full bg-gold"
                  style={{
                    animation: `carousel-progress ${INTERVAL_MS}ms linear forwards`
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes carousel-progress {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </div>
  );
}

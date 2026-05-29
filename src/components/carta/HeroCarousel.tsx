"use client";

import { useState, useEffect, useCallback } from "react";

/* Candidatos en orden — agrega restaurant-hero3.jpg, 4, etc. y aparecen solos */
const STATIC_SLIDES = [
  "/restaurant-hero1.jpg",
  "/restaurant-hero2.jpg",
  "/restaurant-hero3.jpg",
  "/restaurant-hero4.jpg",
  "/restaurant-hero5.jpg"
];

const INTERVAL_MS = 5000;

interface HeroCarouselProps {
  /** Overlay que se pinta encima de cada imagen */
  overlay?: string;
  className?: string;
}

export function HeroCarousel({ overlay = "bg-gradient-to-t from-ink via-ink/50 to-ink/20", className = "" }: HeroCarouselProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  /* detecta qué imágenes existen cargándolas en background */
  useEffect(() => {
    let active = true;
    const found: string[] = [];

    const checks = STATIC_SLIDES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload  = () => { found.push(src); resolve(); };
          img.onerror = () => resolve();
          img.src = src;
        })
    );

    Promise.all(checks).then(() => {
      if (active && found.length > 0) setSlides(found);
    });

    return () => { active = false; };
  }, []);

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

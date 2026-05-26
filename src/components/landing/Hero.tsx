import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,184,99,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(232,184,99,0.07)_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />

      <div className="bistro-container relative pb-20 text-center md:pb-28">
        <div className="mx-auto mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="eyebrow">SaaS gastronómico · LATAM</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        <h1 className="mx-auto max-w-5xl text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
          El sistema operativo del{" "}
          <span className="gold-gradient-text italic">restaurante moderno</span>.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-paper/68 md:text-lg">
          Bistró OS unifica pedidos, reservas por WhatsApp, cocina y ventas
          en una sola plataforma para restaurantes de gama media-alta.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/demo" className="btn-gold">
            Probar 14 días gratis
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            Ver demo
          </Link>
        </div>

        <p className="mt-5 text-xs text-mute">
          Prototipo funcional · Sin credenciales reales · Preparado para Supabase y n8n
        </p>
      </div>
    </section>
  );
}

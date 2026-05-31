import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[88svh] overflow-hidden pt-24 md:pt-28">
      <video
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-90 blur-[1px]"
        autoPlay
        muted
        loop
        playsInline
        poster="/bistro-palermo-hero1.jpg"
        aria-hidden="true"
      >
        <source src="/Bistro.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-ink/38" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/48 via-ink/18 to-ink/88" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink to-transparent" />

      <div className="bistro-container relative flex min-h-[calc(88svh-6rem)] items-center pb-16">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center rounded-full border border-gold/25 bg-ink/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold backdrop-blur-md">
            SaaS gastronómico · LATAM
          </div>

          <h1 className="max-w-3xl text-[clamp(4.5rem,13vw,10rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-paper">
            Bistró OS
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-paper/78 md:text-xl">
            Una plataforma interna para operar restaurantes modernos: carta, reservas,
            pedidos, cocina, caja y análisis en un solo lugar.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-gold">
              Entrar al sistema
            </Link>
            <Link href="/demo" className="btn-ghost border-paper/25 bg-ink/30 backdrop-blur-md">
              Solicitar demo
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 text-sm text-paper/68 sm:grid-cols-3">
            <div className="border-l border-gold/45 pl-4">
              <p className="font-semibold text-paper">Multi-restaurante</p>
              <p className="mt-1 text-paper/52">Roles, sucursales y operación.</p>
            </div>
            <div className="border-l border-gold/45 pl-4">
              <p className="font-semibold text-paper">Carta viva</p>
              <p className="mt-1 text-paper/52">QR, disponibilidad e imágenes.</p>
            </div>
            <div className="border-l border-gold/45 pl-4">
              <p className="font-semibold text-paper">Cocina ágil</p>
              <p className="mt-1 text-paper/52">Pedidos y tickets por estación.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

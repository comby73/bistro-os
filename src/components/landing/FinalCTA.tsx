import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,184,99,0.16),transparent_45%)]" />
      <div className="bistro-container relative text-center">
        <h2 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-7xl">
          El próximo servicio puede operar con más control.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-paper/62 md:text-base">
          Probá el flujo completo: landing, demo, dashboard, reservas, pedidos y cocina.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/demo" className="btn-gold">
            Solicitar demo
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            Ver panel MVP
          </Link>
        </div>
      </div>
    </section>
  );
}

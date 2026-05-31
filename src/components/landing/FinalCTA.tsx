import Link from "next/link";

export function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-layer1/35 py-24 md:py-32">
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
          <Link href="/login" className="btn-ghost">
            Entrar al sistema
          </Link>
        </div>
      </div>
    </section>
  );
}

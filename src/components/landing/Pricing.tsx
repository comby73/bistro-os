import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$49",
    setup: "Setup desde USD 149",
    description: "Para restaurantes que quieren ordenar reservas y pedidos.",
    features: ["1 local", "Pedidos básicos", "Dashboard inicial", "Hasta 3 usuarios"],
    highlighted: false
  },
  {
    name: "Pro",
    price: "$129",
    setup: "Setup desde USD 299",
    description: "Para restaurantes con operación constante y equipo activo.",
    features: [
      "Todo en Starter",
      "Agente WhatsApp",
      "KDS por estación",
      "Reportes operativos",
      "Hasta 15 usuarios"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "A medida",
    setup: "Implementación consultiva",
    description: "Para grupos gastronómicos, hoteles o multi-sucursal.",
    features: ["Multi-sucursal", "SLA", "Integraciones", "Onboarding dedicado"],
    highlighted: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-line bg-layer1/35 py-24 md:py-32">
      <div className="bistro-container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="eyebrow mb-4">Precios</p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Suscripción mensual con setup inicial.
          </h2>
          <p className="mt-5 text-sm leading-7 text-paper/60">
            El setup reduce riesgo: permite adaptar carta, roles, cocina y flujos al restaurante real.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative rounded-2xl border border-gold/40 bg-layer2 p-8 shadow-gold"
                  : "card-premium p-8"
              }
            >
              {plan.highlighted && (
                <span className="mb-5 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                  Recomendado
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.06em]">{plan.price}</span>
                {plan.price !== "A medida" && <span className="pb-2 text-sm text-mute">/mes</span>}
              </div>
              <p className="mt-2 text-xs text-gold">{plan.setup}</p>
              <p className="mt-5 text-sm leading-7 text-paper/62">{plan.description}</p>

              <ul className="mt-8 space-y-3 text-sm text-paper/78">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-gold">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/demo" className={plan.highlighted ? "btn-gold mt-8 w-full" : "btn-ghost mt-8 w-full"}>
                {plan.name === "Enterprise" ? "Contactar" : "Probar demo"}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Configurá carta, mesas y equipo",
    description:
      "Cargá tu menú, definí horarios, roles y estaciones de cocina para operar con una única fuente de verdad."
  },
  {
    number: "02",
    title: "Recibí reservas y pedidos",
    description:
      "La landing y el agente de WhatsApp capturan solicitudes, validan datos y envían eventos al sistema."
  },
  {
    number: "03",
    title: "Operá desde dashboard y cocina",
    description:
      "El dueño ve métricas, el salón ve pedidos y la cocina recibe tickets organizados por estación."
  }
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-line py-24 md:py-32">
      <div className="bistro-container">
        <div className="mb-14 max-w-3xl">
          <p className="eyebrow mb-4">Cómo funciona</p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Tres pasos para ordenar una operación completa.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="bg-layer1 p-8 md:p-10">
              <p className="gold-gradient-text mb-12 text-7xl font-semibold tracking-[-0.06em]">
                {step.number}
              </p>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-7 text-paper/62">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

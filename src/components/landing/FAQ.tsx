const faqs = [
  {
    question: "¿Esto es una app para clientes o para el restaurante?",
    answer:
      "Ambas capas existen. La landing y el menú QR son visibles para clientes; el dashboard, cocina y reservas son herramientas internas del restaurante."
  },
  {
    question: "¿La IA toma decisiones sola?",
    answer:
      "No. La IA funciona como capa asistiva: resume, clasifica y recomienda. Las decisiones críticas quedan validadas por reglas, estados y confirmación humana cuando hace falta."
  },
  {
    question: "¿Por qué Supabase?",
    answer:
      "Porque permite trabajar con PostgreSQL, autenticación, API REST automática y escalabilidad suficiente para un MVP serio."
  },
  {
    question: "¿Por qué n8n?",
    answer:
      "Porque permite transformar eventos del sistema en workflows: guardar leads, notificar al equipo, clasificar consultas y registrar logs."
  },
  {
    question: "¿Qué parte está simulada?",
    answer:
      "En esta versión base, los datos de dashboard, pedidos y reservas son mocks. El schema, los agentes y los workflows quedan preparados para conectarse a servicios reales."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-line py-24 md:py-32">
      <div className="bistro-container grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
            Preguntas que te pueden hacer en la defensa.
          </h2>
        </div>

        <div className="divide-y divide-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="text-lg font-semibold">{faq.question}</span>
                <span className="text-gold transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-paper/62">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

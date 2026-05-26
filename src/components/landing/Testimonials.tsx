const testimonials = [
  {
    name: "Sofía Mendoza",
    role: "Chef-propietaria · Casa Yvonne",
    quote:
      "La promesa de Bistró OS es clara: menos fricción operativa y más control sobre el servicio. El prototipo refleja muy bien esa necesidad."
  },
  {
    name: "Tomás Errázuriz",
    role: "Director · Pulpería del Puerto",
    quote:
      "El dashboard ayuda a pensar el restaurante como negocio. No es solo una carta digital, es una herramienta de decisión."
  },
  {
    name: "Lucía Battaglia",
    role: "Gerente · Bistró Mileto",
    quote:
      "El panel de cocina y reservas resuelve un problema real: tener al equipo mirando la misma información en tiempo real."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-line py-24 md:py-32">
      <div className="bistro-container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="eyebrow mb-4">Validación simulada</p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Testimonios ficticios para representar usuarios objetivo.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="card-premium p-8">
              <div className="mb-6 text-gold">★★★★★</div>
              <blockquote className="text-base leading-7 text-paper/82">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-line pt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="mt-1 text-xs text-mute">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-mute">
          Nota: testimonios y métricas usados como recurso narrativo del prototipo comercial.
        </p>
      </div>
    </section>
  );
}

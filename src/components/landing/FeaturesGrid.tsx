import {
  BarChart3,
  ChefHat,
  ClipboardList,
  MessageCircle,
  Tags,
  Utensils
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Pedidos unificados",
    description: "Comandas de salón, barra y take away organizadas por estado y prioridad."
  },
  {
    icon: BarChart3,
    title: "Panel de ventas",
    description: "Métricas de venta diaria, ticket promedio y evolución operativa."
  },
  {
    icon: MessageCircle,
    title: "Agente WhatsApp",
    description: "Reservas, consultas frecuentes y derivación a humano cuando corresponde."
  },
  {
    icon: ChefHat,
    title: "Cocina en tiempo real",
    description: "Tickets KDS por estación: caliente, frío, parrilla, barra y pase."
  },
  {
    icon: Tags,
    title: "Menú digital",
    description: "Carta QR editable, categorías, precios, disponibilidad y platos destacados."
  },
  {
    icon: Utensils,
    title: "Operación modular",
    description: "Cada módulo puede crecer sin romper el resto de la aplicación."
  }
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-t border-line bg-layer1/35 py-24 md:py-32">
      <div className="bistro-container">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Plataforma</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Funciones reales para un MVP defendible.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-paper/60">
            La IA acompaña el flujo operativo, pero las reglas críticas quedan validadas por datos y lógica de negocio.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group bg-layer1 p-8 transition hover:bg-layer2">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink text-gold transition group-hover:border-gold/50">
                  <Icon size={20} strokeWidth={1.7} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-7 text-paper/62">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

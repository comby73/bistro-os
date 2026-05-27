import type { MenuSummary } from "@/features/menu/types";

export function MenuSummaryCards({ summary }: { summary: MenuSummary }) {
  const cards = [
    { label: "Total productos", value: summary.total },
    { label: "Disponibles", value: summary.available },
    { label: "No disponibles", value: summary.unavailable },
    { label: "Destacados", value: summary.featured }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-3xl border border-line bg-layer1/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/42">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-gold">{card.value}</p>
        </article>
      ))}
    </div>
  );
}

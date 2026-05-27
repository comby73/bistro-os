import type { MenuItem } from "@/features/menu/types";

function StatusBadge({
  label,
  tone
}: {
  label: string;
  tone: "gold" | "muted" | "paper";
}) {
  const className =
    tone === "gold"
      ? "border-gold/30 bg-gold/10 text-gold"
      : tone === "paper"
        ? "border-line bg-layer1/70 text-paper/72"
        : "border-line bg-ink/80 text-paper/45";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${className}`}>
      {label}
    </span>
  );
}

export function MenuItemCard({
  item,
  canEdit,
  compact,
  onToggleAvailability,
  onToggleFeatured
}: {
  item: MenuItem;
  canEdit: boolean;
  compact?: boolean;
  onToggleAvailability?: (itemId: string) => void;
  onToggleFeatured?: (itemId: string) => void;
}) {
  return (
    <article
      className={
        compact
          ? "rounded-3xl border border-line bg-layer1/55 p-4"
          : "rounded-3xl border border-line bg-layer1/55 p-5"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">{item.name}</h3>
            {item.featured && <StatusBadge label="Destacado" tone="gold" />}
            <StatusBadge label={item.available ? "Disponible" : "No disponible"} tone={item.available ? "paper" : "muted"} />
          </div>
          <p className="mt-2 text-sm leading-6 text-paper/55">{item.description}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/42">Precio</p>
          <p className="mt-1 text-2xl font-semibold text-gold">USD {item.price}</p>
        </div>
      </div>

      {canEdit ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onToggleAvailability?.(item.id)}
            className={
              item.available
                ? "rounded-2xl border border-gold/25 bg-gold/8 px-4 py-2.5 text-sm text-gold transition hover:border-gold/40"
                : "rounded-2xl border border-line bg-ink/80 px-4 py-2.5 text-sm text-paper/70 transition hover:border-gold/30 hover:text-paper"
            }
          >
            {item.available ? "Marcar no disponible" : "Marcar disponible"}
          </button>
          <button
            type="button"
            onClick={() => onToggleFeatured?.(item.id)}
            className={
              item.featured
                ? "rounded-2xl border border-gold/25 bg-gold/8 px-4 py-2.5 text-sm text-gold transition hover:border-gold/40"
                : "rounded-2xl border border-line bg-ink/80 px-4 py-2.5 text-sm text-paper/70 transition hover:border-gold/30 hover:text-paper"
            }
          >
            {item.featured ? "Quitar destacado" : "Marcar destacado"}
          </button>
        </div>
      ) : (
        <div className="mt-4 text-xs uppercase tracking-[0.18em] text-paper/38">
          {compact ? "Consulta rápida de carta" : "Vista de supervisión sin edición"}
        </div>
      )}
    </article>
  );
}

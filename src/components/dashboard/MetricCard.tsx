const accentStyles = {
  gold:    { border: "border-t-gold/70",         glow: "shadow-gold/10",        bar: "bg-gold" },
  emerald: { border: "border-t-emerald-400/60",  glow: "shadow-emerald-400/10", bar: "bg-emerald-400" },
  sky:     { border: "border-t-sky-400/60",      glow: "shadow-sky-400/10",     bar: "bg-sky-400" },
  amber:   { border: "border-t-amber-400/60",    glow: "shadow-amber-400/10",   bar: "bg-amber-400" },
  muted:   { border: "border-t-paper/15",        glow: "",                      bar: "bg-paper/20" }
} as const;

const valueStyles = {
  gold:    "text-paper",
  emerald: "text-emerald-400",
  sky:     "text-sky-300",
  amber:   "text-amber-400",
  muted:   "text-paper/80"
} as const;

export function MetricCard({
  label,
  value,
  hint,
  accent = "gold"
}: {
  label: string;
  value: string;
  hint: string;
  accent?: keyof typeof accentStyles;
}) {
  const styles = accentStyles[accent];

  return (
    <article
      className={`card-animated card-premium group border-t-2 p-6 ${styles.border}`}
    >
      <p className="eyebrow mb-4">{label}</p>
      <p className={`text-[3rem] font-bold tracking-[-0.06em] leading-none md:text-[3.4rem] ${valueStyles[accent]}`}>
        {value}
      </p>
      <p className="mt-4 text-[15px] leading-6 text-paper/72">{hint}</p>

      {/* barra de acento inferior animada en hover */}
      <div className={`mt-5 h-[2px] w-0 rounded-full ${styles.bar} transition-all duration-500 group-hover:w-full opacity-40`} />
    </article>
  );
}

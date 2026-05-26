export function MetricCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="card-premium p-6">
      <p className="eyebrow mb-4">{label}</p>
      <p className="text-4xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-3 text-xs leading-5 text-paper/55">{hint}</p>
    </article>
  );
}

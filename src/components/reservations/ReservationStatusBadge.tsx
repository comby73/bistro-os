import type { ReservationStatus } from "@/features/reservations/types";

const labels: Record<ReservationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  seated: "Sentada",
  cancelled: "Cancelada",
  completed: "Completada"
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const classes =
    status === "pending"
      ? "border-gold/30 bg-gold/10 text-gold"
      : status === "confirmed"
        ? "border-sky-400/30 bg-sky-400/10 text-sky-200"
        : status === "seated"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : status === "cancelled"
            ? "border-red-400/30 bg-red-400/10 text-red-200"
            : "border-paper/20 bg-paper/5 text-paper/75";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${classes}`}>
      {labels[status]}
    </span>
  );
}

import type { ReservationStatus } from "@/features/reservations/types";

const labels: Record<ReservationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada"
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
      {labels[status]}
    </span>
  );
}

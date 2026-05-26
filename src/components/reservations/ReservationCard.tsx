import type { Reservation } from "@/features/reservations/types";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

export function ReservationCard({ reservation }: { reservation: Reservation }) {
  return (
    <article className="card-premium p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{reservation.customer_name}</h3>
          <p className="mt-1 text-sm text-paper/60">
            {reservation.date} · {reservation.time} · {reservation.party_size} personas
          </p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>
      {reservation.notes && <p className="text-sm leading-6 text-paper/60">{reservation.notes}</p>}
      <div className="mt-5 flex gap-2">
        <button className="btn-gold px-4 py-2 text-xs">Confirmar</button>
        <button className="btn-ghost px-4 py-2 text-xs">Cancelar</button>
      </div>
    </article>
  );
}

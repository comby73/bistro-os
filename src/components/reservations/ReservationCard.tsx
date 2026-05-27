"use client";

import { useState } from "react";
import type { Reservation, ReservationStatus } from "@/features/reservations/types";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

function ActionButton({
  label,
  onClick,
  tone = "ghost"
}: {
  label: string;
  onClick: () => void;
  tone?: "ghost" | "gold";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === "gold"
          ? "rounded-2xl border border-gold/35 bg-gold/12 px-4 py-3 text-sm font-medium text-gold transition hover:border-gold/55 hover:bg-gold/18"
          : "rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm text-paper/70 transition hover:border-gold/30 hover:text-paper"
      }
    >
      {label}
    </button>
  );
}

export function ReservationCard({
  reservation,
  canManage,
  onUpdateStatus,
  onAssignTable
}: {
  reservation: Reservation;
  canManage: boolean;
  onUpdateStatus: (reservationId: string, status: ReservationStatus) => void;
  onAssignTable: (reservationId: string, tableAssigned: string) => void;
}) {
  const [tableAssigned, setTableAssigned] = useState(reservation.table_assigned ?? "");

  return (
    <article className="rounded-3xl border border-line bg-layer1/55 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-paper/42">{reservation.date}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{reservation.time}</h3>
          <p className="mt-2 font-medium text-paper">{reservation.customer_name}</p>
          <p className="mt-1 text-sm text-paper/52">
            {reservation.party_size} personas
            {reservation.contact_phone ? ` · ${reservation.contact_phone}` : ""}
          </p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-ink/60 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.18em] text-paper/40">Mesa</span>
          <span className="mt-1 block font-medium text-paper">
            {reservation.table_assigned ?? "Sin asignar"}
          </span>
        </div>
        <div className="rounded-2xl border border-line bg-ink/60 px-4 py-3">
          <span className="block text-xs uppercase tracking-[0.18em] text-paper/40">Estado</span>
          <span className="mt-1 block font-medium text-paper">{reservation.status}</span>
        </div>
        {reservation.notes && (
          <div className="rounded-2xl border border-line bg-ink/60 px-4 py-3 sm:col-span-2">
            <span className="block text-xs uppercase tracking-[0.18em] text-paper/40">Notas</span>
            <span className="mt-1 block">{reservation.notes}</span>
          </div>
        )}
      </div>

      {canManage ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {reservation.status === "pending" && (
              <>
                <ActionButton
                  label="Confirmar reserva"
                  tone="gold"
                  onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                />
                <ActionButton
                  label="Cancelar"
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                />
              </>
            )}

            {reservation.status === "confirmed" && (
              <>
                <ActionButton
                  label="Sentar cliente"
                  tone="gold"
                  onClick={() => onUpdateStatus(reservation.id, "seated")}
                />
                <ActionButton
                  label="Cancelar"
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                />
              </>
            )}

            {reservation.status === "seated" && (
              <>
                <ActionButton
                  label="Marcar completada"
                  tone="gold"
                  onClick={() => onUpdateStatus(reservation.id, "completed")}
                />
                <ActionButton
                  label="Cancelar"
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                />
              </>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              className="flex-1 rounded-2xl border border-line bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={tableAssigned}
              onChange={(event) => setTableAssigned(event.target.value)}
              placeholder="Mesa 5"
            />
            <button
              type="button"
              onClick={() => onAssignTable(reservation.id, tableAssigned)}
              className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm text-paper/70 transition hover:border-gold/30 hover:text-paper"
            >
              Guardar mesa
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-ink/50 px-4 py-3 text-sm text-paper/55">
          Vista operativa de solo lectura.
        </div>
      )}
    </article>
  );
}

"use client";

import { useState } from "react";
import { Clock, Users, Phone, MapPin } from "lucide-react";
import type { Reservation, ReservationStatus } from "@/features/reservations/types";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

const STATUS_BORDER: Record<ReservationStatus, string> = {
  pending:   "border-amber-400/30",
  confirmed: "border-emerald-400/25",
  seated:    "border-sky-400/25",
  completed: "border-line",
  cancelled: "border-line/50"
};

const STATUS_INDICATOR: Record<ReservationStatus, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-emerald-400",
  seated:    "bg-sky-400",
  completed: "bg-paper/30",
  cancelled: "bg-paper/15"
};

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
          ? "rounded-2xl border border-gold/35 bg-gold/12 px-4 py-3.5 text-[15px] font-semibold text-gold transition-all duration-200 hover:border-gold/55 hover:bg-gold/20 active:scale-[0.98]"
          : "rounded-2xl border border-line bg-layer1/60 px-4 py-3.5 text-[15px] font-medium text-paper/78 transition-all duration-200 hover:border-gold/30 hover:text-paper active:scale-[0.98]"
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
  const borderClass  = STATUS_BORDER[reservation.status]    ?? "border-line";
  const indicatorCls = STATUS_INDICATOR[reservation.status] ?? "bg-paper/30";

  return (
    <article className={`card-animated rounded-3xl border bg-layer1/60 p-5 transition-all duration-300 hover:bg-layer1/80 ${borderClass}`}>

      {/* — cabecera: hora + badge + indicador — */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* indicador de color de estado */}
          <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${indicatorCls}`} />
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.12em] text-paper/60">
              <Clock size={12} />
              {reservation.date} · {reservation.time}
            </p>
            <h3 className="mt-2 text-[20px] font-bold tracking-[-0.03em] text-paper">
              {reservation.customer_name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[15px] text-paper/72">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {reservation.party_size} personas
              </span>
              {reservation.contact_phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {reservation.contact_phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      {/* — detalles — */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-ink/50 px-3.5 py-3">
          <MapPin size={13} className="shrink-0 text-paper/45" />
          <div>
            <span className="block text-[12px] uppercase tracking-[0.13em] text-paper/55">Mesa</span>
            <span className="mt-1 block text-[16px] font-semibold text-paper">
              {reservation.table_assigned ?? "Sin asignar"}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-ink/50 px-3.5 py-3">
          <span className="block text-[12px] uppercase tracking-[0.13em] text-paper/55">Estado</span>
          <span className="mt-1 block text-[16px] font-semibold capitalize text-paper">{reservation.status}</span>
        </div>
        {reservation.notes && (
          <div className="rounded-2xl border border-line bg-ink/50 px-3.5 py-3 sm:col-span-2">
            <span className="block text-[12px] uppercase tracking-[0.13em] text-paper/55">Notas</span>
            <span className="mt-1 block text-[15px] leading-6 text-paper/82">{reservation.notes}</span>
          </div>
        )}
      </div>

      {canManage ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {reservation.status === "pending" && (
              <>
                <ActionButton label="Confirmar reserva" tone="gold" onClick={() => onUpdateStatus(reservation.id, "confirmed")} />
                <ActionButton label="Cancelar"                       onClick={() => onUpdateStatus(reservation.id, "cancelled")} />
              </>
            )}
            {reservation.status === "confirmed" && (
              <>
                <ActionButton label="Sentar cliente" tone="gold" onClick={() => onUpdateStatus(reservation.id, "seated")} />
                <ActionButton label="Cancelar"                   onClick={() => onUpdateStatus(reservation.id, "cancelled")} />
              </>
            )}
            {reservation.status === "seated" && (
              <>
                <ActionButton label="Marcar completada" tone="gold" onClick={() => onUpdateStatus(reservation.id, "completed")} />
                <ActionButton label="Cancelar"                       onClick={() => onUpdateStatus(reservation.id, "cancelled")} />
              </>
            )}
          </div>

          <div className="mt-3 flex gap-2.5">
            <input
              className="flex-1 rounded-2xl border border-line bg-ink px-4 py-3 text-[14px] text-paper outline-none placeholder:text-paper/35 transition-all duration-200 focus:border-gold/60 focus:ring-1 focus:ring-gold/20"
              value={tableAssigned}
              onChange={(event) => setTableAssigned(event.target.value)}
              placeholder="Mesa 5"
            />
            <button
              type="button"
              onClick={() => onAssignTable(reservation.id, tableAssigned)}
              className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[13px] font-medium text-paper/75 transition-all duration-200 hover:border-gold/30 hover:text-paper"
            >
              Guardar
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-ink/50 px-4 py-3 text-[13px] text-paper/62">
          Vista de solo lectura.
        </div>
      )}
    </article>
  );
}

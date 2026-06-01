"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import type { RoleId } from "@/features/auth/roles";
import { useDemoClock } from "@/features/orders/demo-clock";
import {
  filterReservations,
  getNextUpcomingReservation,
  getReservationCounts,
  getTodayReservations,
  sortReservations
} from "@/features/reservations/calculations";
import { useDemoReservations } from "@/features/reservations/demo-store";
import type {
  CreateReservationInput,
  Reservation,
  ReservationFilter,
  ReservationsDataSource,
  ReservationStatus
} from "@/features/reservations/types";
import { ReservationCard } from "./ReservationCard";
import { ReservationComposer } from "./ReservationComposer";
import { ReservationFilters } from "./ReservationFilters";

export function ReservationsWorkspace({
  roleId,
  initialReservations,
  dataSource,
  persistCreate,
  persistStatus,
  persistTable,
  persistCancel,
  restaurantId
}: {
  roleId: RoleId;
  initialReservations?: Reservation[];
  dataSource: ReservationsDataSource;
  persistCreate?: (input: CreateReservationInput) => Promise<{ reservation?: Reservation }>;
  persistStatus?: (
    reservationId: string,
    status: ReservationStatus
  ) => Promise<unknown>;
  persistTable?: (reservationId: string, tableAssigned: string) => Promise<unknown>;
  persistCancel?: (reservationId: string) => Promise<unknown>;
  restaurantId?: string;
}) {
  const {
    reservations,
    createReservation,
    updateReservationStatus,
    assignReservationTable
  } =
    useDemoReservations({
      initialReservations,
      dataSource,
      persistCreate,
      persistStatus,
      persistTable,
      persistCancel,
      restaurantId
    });
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>("all");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const currentTime = useDemoClock();

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setLastRefresh(new Date());
    setTimeout(() => setRefreshing(false), 800);
  }, [router]);

  // Auto-refresh cada 30 segundos si la fuente es Supabase
  useEffect(() => {
    if (dataSource !== "supabase") return;
    const interval = setInterval(handleRefresh, 30_000);
    return () => clearInterval(interval);
  }, [dataSource, handleRefresh]);
  const canManage = roleId === "owner" || roleId === "admin" || roleId === "manager";
  const today = currentTime > 0 ? new Date(currentTime).toISOString().slice(0, 10) : "";
  const nowTime =
    currentTime > 0
      ? new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(new Date(currentTime))
      : "";
  const baseReservations = canManage
    ? reservations
    : today
      ? getTodayReservations(reservations, today)
      : reservations;
  const counts = useMemo(() => {
    const statusCounts = getReservationCounts(baseReservations);
    return {
      all: baseReservations.length,
      ...statusCounts
    };
  }, [baseReservations]);
  const nextReservation = useMemo(
    () =>
      today && nowTime
        ? getNextUpcomingReservation(baseReservations, today, nowTime)
        : null,
    [baseReservations, nowTime, today]
  );
  const filteredReservations = useMemo(
    () => sortReservations(filterReservations(baseReservations, activeFilter)),
    [activeFilter, baseReservations]
  );

  return (
    <section className="mx-auto max-w-[1320px] space-y-6">
      {canManage && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <ReservationComposer createReservation={createReservation} />
          <section className="card-premium p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Estado del turno</p>
                <h3 className="text-2xl font-semibold">Vista operativa de reservas</h3>
              </div>
              {counts.pending > 0 && (
                <div className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold">
                  {counts.pending} pendientes
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.2fr]">
              <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Pendientes</p>
                <p className="mt-2 text-3xl font-semibold text-gold">{counts.pending}</p>
              </div>
              <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Confirmadas</p>
                <p className="mt-2 text-3xl font-semibold text-gold">{counts.confirmed}</p>
              </div>
              <div className="rounded-2xl border border-line bg-layer1/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Sentadas</p>
                <p className="mt-2 text-3xl font-semibold text-gold">{counts.seated}</p>
              </div>
              <div className="rounded-2xl border border-line bg-ink/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Próxima reserva</p>
                {nextReservation ? (
                  <>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-paper">
                      {nextReservation.time}
                    </p>
                    <p className="mt-1 text-sm text-paper/65">{nextReservation.customer_name}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-paper/40">
                      {nextReservation.party_size} personas
                      {nextReservation.table_assigned ? ` · ${nextReservation.table_assigned}` : ""}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-paper/55">Sin reservas próximas para este corte.</p>
                )}
              </div>
            </div>

            {counts.pending > 0 && (
              <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/8 px-4 py-3 text-sm text-paper/72">
                Hay reservas pendientes que todavía requieren confirmación del salón.
              </div>
            )}
          </section>
        </div>
      )}

      {!canManage && (
        <section className="card-premium max-w-3xl p-6">
          <p className="eyebrow mb-3">Reservas del día</p>
          <h3 className="text-2xl font-semibold">Consulta operativa</h3>
          <p className="mt-3 text-sm leading-7 text-paper/58">
            Este rol puede consultar el estado de las reservas de hoy, sin editar.
          </p>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ReservationFilters activeFilter={activeFilter} onChange={setActiveFilter} counts={counts} />
        <div className="flex items-center gap-3">
          {dataSource === "supabase" && (
            <span className="text-xs text-paper/35">
              Actualizado {lastRefresh.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-paper/60 transition-all hover:border-gold/30 hover:text-gold disabled:opacity-40"
            title="Actualizar reservas"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Actualizar
          </button>
          <p className="text-sm text-paper/48">
            {filteredReservations.length} reservas
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            canManage={canManage}
            onUpdateStatus={updateReservationStatus}
            onAssignTable={assignReservationTable}
          />
        ))}

        {filteredReservations.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line p-6 text-sm text-paper/45">
            No hay reservas para ese filtro.
          </div>
        )}
      </div>
    </section>
  );
}

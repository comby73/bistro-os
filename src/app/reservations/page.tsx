import { AppShell } from "@/components/layout/AppShell";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { reservations } from "@/features/reservations/mock-data";

export default function ReservationsPage() {
  return (
    <AppShell currentPath="/reservations">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Reservas</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Gestión de reservas.
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

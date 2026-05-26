import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { reservations } from "@/features/reservations/mock-data";

export default function ReservationsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-12">
          <div className="mb-10">
            <p className="eyebrow mb-3">Reservas</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Gestión de reservas.
            </h1>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

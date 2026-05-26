import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { KitchenTicketCard } from "@/components/kitchen/KitchenTicketCard";
import { kitchenTickets } from "@/features/kitchen/mock-data";
import { KITCHEN_STATIONS } from "@/lib/constants/status";

export default function KitchenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-12">
          <div className="mb-10">
            <p className="eyebrow mb-3">KDS</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Panel de cocina.
            </h1>
          </div>

          <div className="grid gap-5 xl:grid-cols-5">
            {KITCHEN_STATIONS.map((station) => (
              <section key={station} className="rounded-2xl border border-line bg-layer1/60 p-4">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                  {station}
                </h2>
                <div className="space-y-4">
                  {kitchenTickets
                    .filter((ticket) => ticket.station === station)
                    .map((ticket) => (
                      <KitchenTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

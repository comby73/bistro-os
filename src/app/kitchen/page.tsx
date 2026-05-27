import { AppShell } from "@/components/layout/AppShell";
import { KitchenTicketCard } from "@/components/kitchen/KitchenTicketCard";
import { kitchenTickets } from "@/features/kitchen/mock-data";
import { KITCHEN_STATIONS } from "@/lib/constants/status";

export default function KitchenPage() {
  return (
    <AppShell currentPath="/kitchen">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">KDS</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Panel de cocina.
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-5">
          {KITCHEN_STATIONS.map((station) => (
            <section key={station} className="rounded-2xl border border-line bg-layer1/60 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {station}
              </h3>
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
    </AppShell>
  );
}

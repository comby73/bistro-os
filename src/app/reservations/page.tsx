import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { ReservationsWorkspace } from "@/components/reservations/ReservationsWorkspace";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import {
  cancelReservationAction,
  createReservationAction,
  updateReservationStatusAction,
  updateReservationTableAction
} from "@/features/reservations/actions";
import { getReservations } from "@/features/reservations/repository";

export default async function ReservationsPage() {
  const cookieStore = await cookies();
  const roleId = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  const reservationsResult = await getReservations();
  const initialReservations =
    reservationsResult.dataSource === "supabase"
      ? reservationsResult.reservations
      : undefined;

  return (
    <AppShell currentPath="/reservations">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Reservas</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Gestión de reservas.
          </h2>
        </div>

        {roleId ? (
          <ReservationsWorkspace
            roleId={roleId}
            initialReservations={initialReservations}
            dataSource={reservationsResult.dataSource}
            persistCreate={createReservationAction}
            persistStatus={updateReservationStatusAction}
            persistTable={updateReservationTableAction}
            persistCancel={cancelReservationAction}
          />
        ) : (
          <div className="card-premium p-6 text-sm text-paper/60">
            Seleccioná un rol demo para operar reservas.
          </div>
        )}
      </section>
    </AppShell>
  );
}

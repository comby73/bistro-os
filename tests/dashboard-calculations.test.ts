import { describe, expect, it } from "vitest";
import {
  buildManagerSnapshot,
  buildOwnerAdminMetrics,
  getDashboardAlerts,
  getKitchenCounts
} from "../src/features/dashboard/calculations";
import { orders } from "../src/features/orders/mock-data";
import { reservations } from "../src/features/reservations/mock-data";

describe("dashboard calculations", () => {
  it("resume métricas para owner/admin", () => {
    const metrics = buildOwnerAdminMetrics(orders, reservations);

    // revenueToday viene de salesRecords (mock independiente de orders)
    // activeOrders = received + preparing (no incluye delivered)
    expect(metrics.revenueToday).toBeGreaterThan(0);
    expect(metrics.activeOrders).toBe(2);          // ORD-1042 preparing + ORD-1043 received
    expect(metrics.pendingReservations).toBe(1);
    expect(metrics.averageTicket).toBeGreaterThanOrEqual(0);
  });

  it("deriva conteos de cocina correctamente", () => {
    expect(getKitchenCounts(orders)).toEqual({
      received:  1,
      preparing: 1,
      ready:     0,
      delivered: 1   // ORD-1044 está delivered en el mock
    });
  });

  it("detecta alertas operativas", () => {
    const alerts = getDashboardAlerts(orders, reservations, Date.now());
    expect(alerts.some((alert) => alert.id === "pending-reservations")).toBe(true);
  });

  it("arma snapshot operativo para manager", () => {
    const today    = reservations[0].date;
    const snapshot = buildManagerSnapshot(orders, reservations, today, "20:00", Date.now());

    expect(snapshot.todayReservations.length).toBeGreaterThan(0);
    expect(snapshot.activeOrders).toBe(2);
    expect(snapshot.nextReservation).not.toBeNull();
  });
});

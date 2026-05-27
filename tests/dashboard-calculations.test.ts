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
    expect(buildOwnerAdminMetrics(orders, reservations)).toEqual({
      revenueToday: 332,
      activeOrders: 2,
      pendingReservations: 1,
      averageTicket: 83
    });
  });

  it("deriva conteos de cocina y alertas operativas", () => {
    expect(getKitchenCounts(orders)).toEqual({
      received: 1,
      preparing: 1,
      ready: 0,
      delivered: 0
    });

    const alerts = getDashboardAlerts(orders, reservations, Date.now());
    expect(alerts.some((alert) => alert.id === "pending-reservations")).toBe(true);
  });

  it("arma snapshot operativo para manager", () => {
    const today = reservations[0].date;
    const snapshot = buildManagerSnapshot(orders, reservations, today, "20:00", Date.now());

    expect(snapshot.todayReservations.length).toBeGreaterThan(0);
    expect(snapshot.activeOrders).toBe(2);
    expect(snapshot.nextReservation).not.toBeNull();
  });
});

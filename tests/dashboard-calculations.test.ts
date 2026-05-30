import { describe, expect, it } from "vitest";
import {
  buildManagerSnapshot,
  buildOwnerAdminMetrics,
  getDashboardAlerts,
  getKitchenCounts
} from "../src/features/dashboard/calculations";
import { orders } from "../src/features/orders/mock-data";
import { reservations } from "../src/features/reservations/mock-data";

// El mock de orders ahora cubre los 3 restaurantes; derivamos los conteos
// esperados de la data en vez de hardcodear números frágiles.
const ACTIVE_STATUSES = ["received", "preparing", "ready"] as const;
const expectedActive = orders.filter((o) =>
  (ACTIVE_STATUSES as readonly string[]).includes(o.status)
).length;
const expectedKitchen = {
  received:  orders.filter((o) => o.status === "received").length,
  preparing: orders.filter((o) => o.status === "preparing").length,
  ready:     orders.filter((o) => o.status === "ready").length,
  delivered: orders.filter((o) => o.status === "delivered").length,
};

describe("dashboard calculations", () => {
  it("resume métricas para owner/admin", () => {
    const metrics = buildOwnerAdminMetrics(orders, reservations);

    // revenueToday viene de salesRecords (mock independiente de orders)
    // activeOrders = received + preparing + ready (no incluye delivered)
    expect(metrics.revenueToday).toBeGreaterThan(0);
    expect(metrics.activeOrders).toBe(expectedActive);
    expect(metrics.pendingReservations).toBe(1);
    expect(metrics.averageTicket).toBeGreaterThanOrEqual(0);
  });

  it("deriva conteos de cocina correctamente", () => {
    expect(getKitchenCounts(orders)).toEqual(expectedKitchen);
  });

  it("detecta alertas operativas", () => {
    const alerts = getDashboardAlerts(orders, reservations, Date.now());
    expect(alerts.some((alert) => alert.id === "pending-reservations")).toBe(true);
  });

  it("arma snapshot operativo para manager", () => {
    const today    = reservations[0].date;
    const snapshot = buildManagerSnapshot(orders, reservations, today, "20:00", Date.now());

    expect(snapshot.todayReservations.length).toBeGreaterThan(0);
    expect(snapshot.activeOrders).toBe(expectedActive);
    expect(snapshot.nextReservation).not.toBeNull();
  });
});

import { calculateSalesSummary } from "@/features/sales/calculations";
import { getElapsedMinutes, getOrderTotal, sortOrdersByNewest } from "@/features/orders/calculations";
import {
  getNextUpcomingReservation,
  getReservationCounts,
  getTodayReservations,
  sortReservations
} from "@/features/reservations/calculations";
import type { Order } from "@/features/orders/types";
import type { Reservation } from "@/features/reservations/types";

export interface DashboardAlert {
  id: string;
  title: string;
  detail: string;
  tone: "gold" | "paper";
}

export function getKitchenCounts(orders: Order[]) {
  return {
    received: orders.filter((order) => order.status === "received").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
    delivered: orders.filter((order) => order.status === "delivered").length
  };
}

export function getActiveOrders(orders: Order[]) {
  return orders.filter(
    (order) => order.status === "received" || order.status === "preparing" || order.status === "ready"
  );
}

export function getDelayedOrders(orders: Order[], now: number, thresholdMinutes = 12) {
  return getActiveOrders(orders).filter(
    (order) => getElapsedMinutes(order.created_at, now) >= thresholdMinutes
  );
}

export function getReadyOrders(orders: Order[]) {
  return orders.filter((order) => order.status === "ready");
}

export function getDashboardAlerts(
  orders: Order[],
  reservations: Reservation[],
  now: number
): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];
  const delayedOrders = getDelayedOrders(orders, now);
  const readyOrders = getReadyOrders(orders);
  const pendingReservations = reservations.filter((reservation) => reservation.status === "pending");

  if (delayedOrders.length > 0) {
    alerts.push({
      id: "delayed-orders",
      title: "Pedidos demorados",
      detail: `${delayedOrders.length} comandas superan el tiempo objetivo de cocina.`,
      tone: "gold"
    });
  }

  if (pendingReservations.length > 0) {
    alerts.push({
      id: "pending-reservations",
      title: "Reservas pendientes",
      detail: `${pendingReservations.length} reservas todavía necesitan confirmación.`,
      tone: "paper"
    });
  }

  if (readyOrders.length > 0) {
    alerts.push({
      id: "ready-orders",
      title: "Tickets listos",
      detail: `${readyOrders.length} pedidos están listos para entregar o coordinar salida.`,
      tone: "paper"
    });
  }

  return alerts;
}

export function buildExecutiveSummary(
  orders: Order[],
  reservations: Reservation[],
  now: number
) {
  const activeOrders = getActiveOrders(orders);
  const delayedOrders = getDelayedOrders(orders, now);
  const counts = getReservationCounts(reservations);

  if (activeOrders.length === 0 && reservations.length === 0) {
    return "El turno está calmo. No hay pedidos activos ni reservas en seguimiento inmediato.";
  }

  if (delayedOrders.length > 0) {
    return `Hay ${delayedOrders.length} pedidos demorados; conviene revisar pase y reasignar prioridad de cocina.`;
  }

  if (counts.pending > 0) {
    return `Todavía hay ${counts.pending} reservas pendientes de confirmación antes del próximo pico de servicio.`;
  }

  return "La operación está bajo control: pedidos activos distribuidos y reservas sin alertas críticas.";
}

export function getLatestOperationalOrders(orders: Order[]) {
  return sortOrdersByNewest(orders).slice(0, 4).map((order) => ({
    id: order.id,
    table: order.table,
    amount: getOrderTotal(order),
    status: order.status
  }));
}

export function buildOwnerAdminMetrics(orders: Order[], reservations: Reservation[]) {
  const activeOrders = getActiveOrders(orders);
  const reservationCounts = getReservationCounts(reservations);
  const salesSummary = calculateSalesSummary();

  return {
    revenueToday: salesSummary.totalSales,
    activeOrders: activeOrders.length,
    pendingReservations: reservationCounts.pending,
    averageTicket: Number(salesSummary.averageTicket.toFixed(0))
  };
}

export function buildManagerSnapshot(
  orders: Order[],
  reservations: Reservation[],
  today: string,
  nowTime: string,
  now: number
) {
  const todayReservations = getTodayReservations(reservations, today);
  const nextReservation = getNextUpcomingReservation(todayReservations, today, nowTime);

  return {
    todayReservations: sortReservations(todayReservations),
    nextReservation,
    activeOrders: getActiveOrders(orders).length,
    delayedOrders: getDelayedOrders(orders, now).length,
    readyOrders: getReadyOrders(orders).length
  };
}

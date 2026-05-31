import { menuItems as baseMenuItems } from "@/features/menu/mock-data";
import { demoMenuItems } from "@/features/restaurants/mock-data";
import type { MenuItem } from "@/features/menu/types";

const seedMenuItems: MenuItem[] = [...baseMenuItems, ...demoMenuItems];
import { orders as seedOrders } from "./mock-data";
import type {
  CreateOrderInput,
  Order,
  OrderStatus
} from "./types";

export const KITCHEN_ACTIVE_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready"
];

export function getInitialOrders(): Order[] {
  return [...seedOrders];
}

export function getOrderStatusLabel(status: OrderStatus): string {
  if (status === "received") return "Recibido";
  if (status === "preparing") return "En preparación";
  if (status === "ready") return "Listo";
  if (status === "delivered") return "Entregado";
  return "Cancelado";
}

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  if (status === "received") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready") return "delivered";
  return null;
}

export function formatOrderCreatedAt(createdAt: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(createdAt));
}

export function getElapsedMinutes(createdAt: string, now = Date.now()): number {
  const diff = Math.max(0, now - new Date(createdAt).getTime());
  return Math.floor(diff / 60_000);
}

export function getOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

export function buildOrderFromInput(
  input: CreateOrderInput,
  menuItems: MenuItem[] = seedMenuItems,
  context: { restaurantId?: string; branchId?: string | null } = {}
): Order {
  const normalizedItems = input.items
    .map((selectedItem) => {
      const menuItem = menuItems.find((item) => item.id === selectedItem.menu_item_id);

      if (!menuItem) return null;

      return {
        menu_item_id: menuItem.id,
        name: menuItem.name,
        quantity: selectedItem.quantity,
        station: menuItem.station,
        unit_price: menuItem.price
      };
    })
    .filter((item) => item !== null);

  return {
    id: createOrderId(),
    restaurant_id: context.restaurantId,
    branch_id: context.branchId ?? null,
    table: input.table.trim(),
    status: "received",
    created_at: new Date().toISOString(),
    waiter_name: input.waiter_name.trim(),
    notes: input.notes?.trim() ? input.notes.trim() : undefined,
    items: normalizedItems
  };
}

function createOrderId(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : `${Date.now()}`.slice(-8);

  return `ORD-${suffix}`;
}

export function groupOrdersByStatus(orders: Order[]): Record<"received" | "preparing" | "ready" | "delivered", Order[]> {
  return {
    received: orders.filter((order) => order.status === "received"),
    preparing: orders.filter((order) => order.status === "preparing"),
    ready: orders.filter((order) => order.status === "ready"),
    delivered: orders.filter((order) => order.status === "delivered")
  };
}

export function sortOrdersByNewest(orders: Order[]): Order[] {
  return [...orders].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  );
}

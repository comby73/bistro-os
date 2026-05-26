export type OrderStatus = "received" | "preparing" | "ready" | "delivered" | "cancelled";

export interface OrderItem {
  name: string;
  quantity: number;
  station: "cold" | "hot" | "grill" | "bar" | "pass";
}

export interface Order {
  id: string;
  table: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

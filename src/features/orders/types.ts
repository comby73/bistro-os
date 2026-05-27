import type { KitchenStation } from "@/features/kitchen/types";

export type OrderStatus = "received" | "preparing" | "ready" | "delivered" | "cancelled";

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  station: KitchenStation;
  unit_price: number;
}

export interface Order {
  id: string;
  table: string;
  status: OrderStatus;
  created_at: string;
  waiter_name: string;
  notes?: string;
  items: OrderItem[];
}

export interface CreateOrderItemInput {
  menu_item_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  table: string;
  waiter_name: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export type KitchenStation = "cold" | "hot" | "grill" | "bar" | "pass";

export interface KitchenTicket {
  id: string;
  order_id: string;
  table: string;
  station: KitchenStation;
  status: "received" | "preparing" | "ready" | "delivered";
  elapsed_minutes: number;
  items: string[];
}

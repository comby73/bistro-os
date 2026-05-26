export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  customer_name: string;
  date: string;
  time: string;
  party_size: number;
  status: ReservationStatus;
  notes?: string;
}

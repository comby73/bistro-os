export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "cancelled"
  | "completed";

export interface Reservation {
  id: string;
  customer_name: string;
  contact_phone: string;
  date: string;
  time: string;
  party_size: number;
  status: ReservationStatus;
  table_assigned?: string;
  notes?: string;
}

export interface CreateReservationInput {
  customer_name: string;
  contact_phone: string;
  date: string;
  time: string;
  party_size: number;
  table_assigned?: string;
  notes?: string;
}

export type ReservationFilter = "all" | ReservationStatus;

export interface ReservationsSnapshot {
  reservations: Reservation[];
}

export type ReservationsDataSource = "local" | "supabase";

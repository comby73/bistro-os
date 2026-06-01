"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ReservaPayload {
  restaurant_id: string;
  branch_id: string;
  customer_name: string;
  customer_contact: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  notes?: string;
}

export interface ReservaResult {
  ok: boolean;
  error?: string;
}

export async function crearReserva(payload: ReservaPayload): Promise<ReservaResult> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("reservations").insert({
      restaurant_id: payload.restaurant_id,
      branch_id: payload.branch_id,
      customer_name: payload.customer_name.trim(),
      customer_contact: payload.customer_contact.trim(),
      reservation_date: payload.reservation_date,
      reservation_time: payload.reservation_time,
      party_size: payload.party_size,
      status: "pending",
      notes: payload.notes?.trim() || null,
      metadata: { source: "web_form" },
    });

    if (error) {
      console.error("[crearReserva] Supabase error:", error);
      return { ok: false, error: "No pudimos guardar la reserva. Intenta de nuevo." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[crearReserva] Unexpected error:", err);
    return { ok: false, error: "Error inesperado. Intenta de nuevo." };
  }
}

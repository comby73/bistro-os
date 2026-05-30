import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getInitialReservations, sortReservations } from "./calculations";
import type {
  CreateReservationInput,
  Reservation,
  ReservationsDataSource
} from "./types";

type ReservationsRepositoryEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

type ReservationRow = {
  id: string;
  customer_name: string;
  customer_contact: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: Reservation["status"];
  notes: string | null;
  metadata: Record<string, unknown> | null;
};

const DEMO_RESTAURANT_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_BRANCH_ID = "00000000-0000-0000-0000-000000000010";

export interface ReservationsResult {
  reservations: Reservation[];
  dataSource: ReservationsDataSource;
}

export interface ReservationMutationResult {
  dataSource: ReservationsDataSource;
  updated: boolean;
  reservation?: Reservation;
}

function getRepositoryEnv(
  env: ReservationsRepositoryEnv = process.env as ReservationsRepositoryEnv
) {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  };
}

export function resolveReservationsDataSource(
  env: ReservationsRepositoryEnv = process.env as ReservationsRepositoryEnv
): ReservationsDataSource {
  return env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY
    ? "supabase"
    : "local";
}

function mapReservationRow(row: ReservationRow): Reservation {
  const metadata = row.metadata ?? {};
  const tableAssigned =
    typeof metadata.table_assigned_label === "string"
      ? metadata.table_assigned_label
      : undefined;

  return {
    id: row.id,
    customer_name: row.customer_name,
    contact_phone: row.customer_contact,
    date: row.reservation_date,
    time: row.reservation_time.slice(0, 5),
    party_size: row.party_size,
    status: row.status,
    table_assigned: tableAssigned,
    notes: row.notes ?? undefined
  };
}

export function getLocalReservationsResult(): ReservationsResult {
  return {
    reservations: sortReservations(getInitialReservations()),
    dataSource: "local"
  };
}

function buildReservationInsertPayload(input: CreateReservationInput) {
  return {
    restaurant_id: DEMO_RESTAURANT_ID,
    branch_id: DEMO_BRANCH_ID,
    customer_name: input.customer_name.trim(),
    customer_contact: input.contact_phone.trim(),
    reservation_date: input.date,
    reservation_time: input.time,
    party_size: input.party_size,
    status: "pending",
    notes: input.notes?.trim() || null,
    metadata: {
      source: "demo",
      table_assigned_label: input.table_assigned?.trim() || null
    }
  };
}

export async function getReservations(
  restaurantId: string = DEMO_RESTAURANT_ID,
  branchId: string | null = DEMO_BRANCH_ID
): Promise<ReservationsResult> {
  if (resolveReservationsDataSource() === "local") {
    return getLocalReservationsResult();
  }

  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("reservations")
      .select(
        "id, customer_name, customer_contact, reservation_date, reservation_time, party_size, status, notes, metadata"
      )
      .eq("restaurant_id", restaurantId);

    if (branchId) {
      query = query.eq("branch_id", branchId);
    }

    const { data, error } = await query
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });

    if (error || !data) {
      return getLocalReservationsResult();
    }

    return {
      reservations: sortReservations((data as ReservationRow[]).map(mapReservationRow)),
      dataSource: "supabase"
    };
  } catch {
    return getLocalReservationsResult();
  }
}

export async function createReservation(
  input: CreateReservationInput
): Promise<ReservationMutationResult> {
  if (resolveReservationsDataSource() !== "supabase") {
    return {
      dataSource: "local",
      updated: false
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("reservations")
      .insert(buildReservationInsertPayload(input))
      .select(
        "id, customer_name, customer_contact, reservation_date, reservation_time, party_size, status, notes, metadata"
      )
      .single();

    if (error || !data) {
      return {
        dataSource: "local",
        updated: false
      };
    }

    return {
      dataSource: "supabase",
      updated: true,
      reservation: mapReservationRow(data as ReservationRow)
    };
  } catch {
    return {
      dataSource: "local",
      updated: false
    };
  }
}

async function updateReservationFields(
  reservationId: string,
  fields: Record<string, unknown>
): Promise<ReservationMutationResult> {
  if (resolveReservationsDataSource() !== "supabase") {
    return {
      dataSource: "local",
      updated: false
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("reservations").update(fields).eq("id", reservationId);

    if (error) {
      return {
        dataSource: "local",
        updated: false
      };
    }

    return {
      dataSource: "supabase",
      updated: true
    };
  } catch {
    return {
      dataSource: "local",
      updated: false
    };
  }
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation["status"]
) {
  return updateReservationFields(reservationId, { status });
}

export async function updateReservationTable(
  reservationId: string,
  tableAssigned: string
) {
  return updateReservationFields(reservationId, {
    metadata: {
      source: "demo",
      table_assigned_label: tableAssigned.trim() || null
    }
  });
}

export async function cancelReservation(reservationId: string) {
  return updateReservationStatus(reservationId, "cancelled");
}

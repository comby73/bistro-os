import { describe, expect, it } from "vitest";
import {
  cancelReservation,
  createReservation,
  getLocalReservationsResult,
  resolveReservationsDataSource,
  updateReservationStatus,
  updateReservationTable
} from "../src/features/reservations/repository";

describe("reservations repository", () => {
  it("mantiene fallback local cuando faltan variables de Supabase", () => {
    expect(
      resolveReservationsDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: ""
      })
    ).toBe("local");
  });

  it("solo activa supabase con configuración completa", () => {
    expect(
      resolveReservationsDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: ""
      })
    ).toBe("local");

    expect(
      resolveReservationsDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: "service"
      })
    ).toBe("supabase");
  });

  it("expone reservas locales utilizables sin credenciales", () => {
    const result = getLocalReservationsResult();

    expect(result.dataSource).toBe("local");
    expect(result.reservations.length).toBeGreaterThan(0);
  });

  it("permite crear y actualizar sin Supabase configurado sin romper el flujo", async () => {
    const createResult = await createReservation({
      customer_name: "Cliente Local",
      contact_phone: "+54 9 11 0000 1111",
      date: "2026-06-04",
      time: "20:00",
      party_size: 2
    });

    const statusResult = await updateReservationStatus("RES-local", "confirmed");
    const tableResult = await updateReservationTable("RES-local", "Mesa 3");
    const cancelResult = await cancelReservation("RES-local");

    expect(createResult.updated).toBe(false);
    expect(statusResult.updated).toBe(false);
    expect(tableResult.updated).toBe(false);
    expect(cancelResult.updated).toBe(false);
    expect(createResult.dataSource).toBe("local");
  });
});

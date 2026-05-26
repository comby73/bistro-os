import { describe, expect, it } from "vitest";
import { reservationSchema } from "../src/features/reservations/schema";

describe("reservationSchema", () => {
  it("rejects party size 0", () => {
    const result = reservationSchema.safeParse({
      customer_name: "Cliente Demo",
      date: "2026-06-02",
      time: "21:00",
      party_size: 0
    });

    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { leadSchema } from "../src/features/leads/schema";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const result = leadSchema.safeParse({
      restaurant_name: "Casa Demo",
      owner_name: "Ana Pérez",
      email: "ana@casademo.com",
      whatsapp: "+5491112345678",
      city: "Buenos Aires",
      restaurant_type: "Bistró",
      number_of_tables: 24,
      plan_interest: "Pro",
      message: "Necesito ordenar reservas y cocina."
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = leadSchema.safeParse({
      restaurant_name: "Casa Demo",
      owner_name: "Ana Pérez",
      email: "email-mal",
      whatsapp: "+5491112345678",
      city: "Buenos Aires",
      restaurant_type: "Bistró",
      number_of_tables: 24,
      plan_interest: "Pro"
    });

    expect(result.success).toBe(false);
  });
});

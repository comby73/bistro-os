import { describe, expect, it } from "vitest";
import { orderSchema } from "../src/features/orders/schema";

describe("orderSchema", () => {
  it("rejects orders without items", () => {
    const result = orderSchema.safeParse({
      table_id: "00000000-0000-0000-0000-000000000001",
      items: []
    });

    expect(result.success).toBe(false);
  });
});

import { z } from "zod";

export const orderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  notes: z.string().optional()
});

export const orderSchema = z.object({
  table_id: z.string().uuid(),
  items: z.array(orderItemSchema).min(1)
});

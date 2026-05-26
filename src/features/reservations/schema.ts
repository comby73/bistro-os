import { z } from "zod";

export const reservationSchema = z.object({
  customer_name: z.string().min(2),
  date: z.string().min(8),
  time: z.string().min(4),
  party_size: z.coerce.number().int().positive(),
  notes: z.string().optional()
});

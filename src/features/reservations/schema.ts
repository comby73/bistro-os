import { z } from "zod";

export const reservationSchema = z.object({
  customer_name: z.string().min(2),
  contact_phone: z.string().min(8),
  date: z.string().min(8),
  time: z.string().min(4),
  party_size: z.coerce.number().int().positive(),
  table_assigned: z.string().optional(),
  notes: z.string().optional()
});

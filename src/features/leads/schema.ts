import { z } from "zod";

export const leadSchema = z.object({
  restaurant_name: z.string().min(2, "Ingresá el nombre del restaurante."),
  owner_name: z.string().min(2, "Ingresá el nombre del responsable."),
  email: z.string().email("Ingresá un email válido."),
  whatsapp: z.string().min(8, "Ingresá un WhatsApp válido."),
  city: z.string().min(2, "Ingresá la ciudad."),
  restaurant_type: z.string().min(2, "Indicá el tipo de restaurante."),
  number_of_tables: z.coerce
    .number()
    .int("Debe ser un número entero.")
    .positive("Debe ser mayor a cero."),
  plan_interest: z.enum(["Starter", "Pro", "Enterprise"]),
  message: z.string().max(600, "El mensaje no puede superar 600 caracteres.").optional()
});

export type LeadFormValues = z.infer<typeof leadSchema>;

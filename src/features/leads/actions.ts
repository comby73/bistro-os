import { leadSchema, type LeadFormValues } from "./schema";

export type SubmitLeadResult =
  | { ok: true; message: string; data: LeadFormValues }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * Función principal de envío de leads.
 *
 * Comportamiento:
 * - Si N8N_LEAD_WEBHOOK_URL está definida → envía al webhook de n8n.
 * - Si no está definida → usa mock (ver submitLeadMock).
 *
 * IMPORTANTE: process.env.N8N_LEAD_WEBHOOK_URL es una variable de servidor.
 * Para que la bifurcación al webhook funcione en producción, esta función
 * debe correr en el servidor (Server Action con "use server", o API Route).
 * Mientras se use desde un componente cliente, siempre caerá en el mock.
 */
export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisá los campos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    // Sin webhook configurado — respuesta simulada.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ok: true,
      message:
        "Solicitud recibida. En una integración real, esto se guardaría en Supabase y activaría n8n.",
      data: parsed.data
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `Error al enviar la solicitud (HTTP ${response.status}). Intentá más tarde.`
      };
    }

    return {
      ok: true,
      message: "¡Gracias! Nos ponemos en contacto a la brevedad.",
      data: parsed.data
    };
  } catch {
    return {
      ok: false,
      message: "No se pudo conectar con el servidor. Intentá más tarde."
    };
  }
}

/** Fallback mock — conservado para tests y desarrollo sin webhook. */
export async function submitLeadMock(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisá los campos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    ok: true,
    message:
      "Solicitud recibida. En una integración real, esto se guardaría en Supabase y activaría n8n.",
    data: parsed.data
  };
}

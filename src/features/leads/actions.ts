"use server";

import { leadSchema, type LeadFormValues } from "./schema";
import { notifyLeadAutomation, type AutomationResult } from "@/lib/automation/n8n";

export type SubmitLeadResult =
  | { ok: true; message: string; data: LeadFormValues; automationStatus: AutomationResult }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
      automationStatus: AutomationResult;
    };

export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisá los campos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      automationStatus: {
        status: "skipped",
        reason: "Validation failed before automation."
      }
    };
  }
  const automationStatus = await notifyLeadAutomation(parsed.data);

  return {
    ok: true,
    message: "¡Gracias! Nos ponemos en contacto a la brevedad.",
    data: parsed.data,
    automationStatus
  };
}

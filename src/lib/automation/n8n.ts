import type { LeadFormValues } from "@/features/leads/schema";

export type AutomationResult =
  | { status: "skipped"; reason: string }
  | { status: "sent" }
  | { status: "failed"; reason: string };

export async function notifyLeadAutomation(lead: LeadFormValues): Promise<AutomationResult> {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      status: "skipped",
      reason: "N8N_LEAD_WEBHOOK_URL is not configured."
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });

    if (!response.ok) {
      return {
        status: "failed",
        reason: `n8n webhook responded with HTTP ${response.status}.`
      };
    }

    return { status: "sent" };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown error while calling n8n webhook.";

    return {
      status: "failed",
      reason
    };
  }
}

export type AiInteractionType =
  | "whatsapp_reservation"
  | "daily_summary"
  | "feedback_analysis"
  | "lead_classification"
  | "qa_validation";

export interface AiInteraction {
  id: string;
  type: AiInteractionType;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
}

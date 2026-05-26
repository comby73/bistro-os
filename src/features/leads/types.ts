export type PlanInterest = "Starter" | "Pro" | "Enterprise";

export type LeadStatus = "new" | "qualified" | "contacted" | "lost" | "converted";

export interface LeadInput {
  restaurant_name: string;
  owner_name: string;
  email: string;
  whatsapp: string;
  city: string;
  restaurant_type: string;
  number_of_tables: number;
  plan_interest: PlanInterest;
  message?: string;
}

export interface Lead extends LeadInput {
  id: string;
  status: LeadStatus;
  lead_score?: "low" | "medium" | "high";
  created_at: string;
}

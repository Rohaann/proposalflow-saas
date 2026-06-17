import { z } from "zod";

export const InvoiceItemSchema = z.object({
  desc: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
});

export const DealSchema = z.object({
  id: z.string().uuid().optional(),
  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email").optional().or(z.literal("")),
  project_type: z.string().min(1, "Project type is required"),
  budget: z.number().min(0).optional(),
  status: z.enum([
    "Draft", "Generated", "Sent", "Viewed", "Signed", "Deposit Paid",
    "In Progress", "Completed", "Paid", "Archived", "Cancelled", "Lost", "Won"
  ]).default("Draft"),
  brief_text: z.string().optional(),
  proposal_content: z.string().optional(),
  contract_content: z.string().optional(),
  invoice_items: z.array(InvoiceItemSchema).default([]),
  risk_score: z.number().optional(),
  risk_level: z.string().optional(),
});

export type Deal = z.infer<typeof DealSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;

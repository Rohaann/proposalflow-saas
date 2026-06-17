"use server";

import { generateContent, generateStructuredData } from "@/lib/ai";
import { InvoiceItemSchema } from "@/lib/schema";
import { z } from "zod";

// --- Input Validation Schemas ---
const basicGenerationSchema = z.object({
  clientBrief: z.string().min(5, "Brief is too short").max(5000, "Brief is too long"),
  projectType: z.string().min(2, "Project type is too short").max(100),
  modelName: z.string().optional()
});

const invoiceGenerationSchema = z.object({
  clientBrief: z.string().min(5).max(5000),
  budget: z.number().positive("Budget must be positive"),
  modelName: z.string().optional()
});

const dealDoctorSchema = z.object({
  proposalContent: z.string().min(50, "Proposal content is too short to analyze").max(20000),
  modelName: z.string().optional()
});

const pricingSchema = z.object({
  service: z.string().min(2).max(100),
  experience: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  modelName: z.string().optional()
});

// --- Server Actions ---

export async function generateProposalAction(rawClientBrief: string, rawProjectType: string, rawModelName?: string) {
  const { clientBrief, projectType, modelName } = basicGenerationSchema.parse({ clientBrief: rawClientBrief, projectType: rawProjectType, modelName: rawModelName });
  
  const system = `You are a professional proposal writer for freelancers and agencies. Create a highly persuasive, detailed business proposal formatted in Markdown. Include sections like Executive Summary, Objectives, Scope of Work, and Timeline. Use a formal yet modern tone.`;
  const prompt = `Project Type: ${projectType}\nClient Brief: ${clientBrief}\nGenerate the proposal:`;
  return await generateContent(prompt, system, modelName);
}

export async function generateContractAction(rawClientBrief: string, rawProjectType: string, rawModelName?: string) {
  const { clientBrief, projectType, modelName } = basicGenerationSchema.parse({ clientBrief: rawClientBrief, projectType: rawProjectType, modelName: rawModelName });
  
  const system = `You are a legal assistant specializing in freelance and agency contracts. Generate a standard Master Services Agreement (MSA) formatted in Markdown. Include sections like Services, Payment Terms, Intellectual Property, Confidentiality, and Termination. Ensure it sounds professional.`;
  const prompt = `Project Type: ${projectType}\nClient Brief: ${clientBrief}\nGenerate the contract:`;
  return await generateContent(prompt, system, modelName);
}

export async function generateInvoiceItemsAction(rawClientBrief: string, rawBudget: number, rawModelName?: string) {
  const { clientBrief, budget, modelName } = invoiceGenerationSchema.parse({ clientBrief: rawClientBrief, budget: rawBudget, modelName: rawModelName });
  
  const system = `You are an expert billing assistant. Based on the client brief and total budget, break down the budget into sensible invoice line items. Return a list of items where each has a description and a price. The total should roughly equal the budget.`;
  const prompt = `Budget: $${budget}\nClient Brief: ${clientBrief}`;
  
  const schema = z.object({
    items: z.array(InvoiceItemSchema)
  });

  const data = await generateStructuredData<{ items: any }>(prompt, system, schema, modelName);
  return data.items;
}

export async function generateDealDoctorAction(rawProposalContent: string, rawModelName?: string) {
  const { proposalContent, modelName } = dealDoctorSchema.parse({ proposalContent: rawProposalContent, modelName: rawModelName });
  
  const system = `You are "Deal Doctor", an expert sales consultant. Analyze the provided proposal and evaluate its risk and potential.
Return your evaluation as structured JSON containing:
- risk_score: a number between 0 and 100 (higher means lower risk/better deal)
- risk_level: "Low", "Medium", or "High"
- feedback: a short paragraph explaining the score and suggesting improvements.`;

  const prompt = `Proposal Content:\n\n${proposalContent}`;

  const schema = z.object({
    risk_score: z.number().min(0).max(100),
    risk_level: z.enum(["Low", "Medium", "High"]),
    feedback: z.string()
  });

  return await generateStructuredData<z.infer<typeof schema>>(prompt, system, schema, modelName);
}

export async function generatePricingIntelligenceAction(rawService: string, rawExperience: string, rawCountry: string, rawModelName?: string) {
  const { service, experience, country, modelName } = pricingSchema.parse({ service: rawService, experience: rawExperience, country: rawCountry, modelName: rawModelName });
  
  const system = `You are a Pricing Intelligence API. Given a service, experience level, and target market, provide realistic market rates for freelance work.
Return JSON containing:
- low: The bottom 25% rate (e.g., "$2,000" or "$50/hr")
- average: The median target rate
- premium: The top 10% rate
- message: A helpful, 2-sentence tip about pricing this service for this market.`;

  const prompt = `Service: ${service}\nExperience Level: ${experience}\nMarket: ${country}`;

  const schema = z.object({
    low: z.string(),
    average: z.string(),
    premium: z.string(),
    message: z.string()
  });

  return await generateStructuredData<z.infer<typeof schema>>(prompt, system, schema, modelName);
}

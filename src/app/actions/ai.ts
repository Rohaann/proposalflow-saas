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
  
  try {
    return await generateContent(prompt, system, modelName);
  } catch (error) {
    console.warn("Falling back to mock proposal due to AI error.");
    return `## Executive Summary\n\nThank you for considering our services for your **${projectType}** project. Based on your brief, we understand you need a comprehensive solution that delivers high impact.\n\n## Scope of Work\n\n1. **Discovery & Strategy**: Initial research and alignment.\n2. **Execution Phase**: Developing the core deliverables.\n3. **Review & Handover**: Revisions and final deployment.\n\n## Timeline & Investment\n\nThe estimated timeline for this project is 4-6 weeks, requiring a total investment of $5,000. We look forward to partnering with you!\n\n*(Note: This is mock data because the AI API key is missing or failed.)*`;
  }
}

export async function generateContractAction(rawClientBrief: string, rawProjectType: string, rawModelName?: string) {
  const { clientBrief, projectType, modelName } = basicGenerationSchema.parse({ clientBrief: rawClientBrief, projectType: rawProjectType, modelName: rawModelName });
  
  const system = `You are a legal assistant specializing in freelance and agency contracts. Generate a standard Master Services Agreement (MSA) formatted in Markdown. Include sections like Services, Payment Terms, Intellectual Property, Confidentiality, and Termination. Ensure it sounds professional.`;
  const prompt = `Project Type: ${projectType}\nClient Brief: ${clientBrief}\nGenerate the contract:`;
  
  try {
    return await generateContent(prompt, system, modelName);
  } catch (error) {
    console.warn("Falling back to mock contract due to AI error.");
    return `# Master Services Agreement\n\nThis Master Services Agreement ("Agreement") is entered into for the **${projectType}** project.\n\n## 1. Services\nProvider agrees to perform the services as outlined in the accepted Proposal.\n\n## 2. Payment Terms\nClient agrees to pay the fees according to the schedule. Invoices are net-30.\n\n## 3. Intellectual Property\nUpon full payment, Client shall own the final deliverables.\n\n## 4. Confidentiality\nBoth parties agree to keep all proprietary information confidential.\n\n*(Note: This is mock data because the AI API key is missing or failed.)*`;
  }
}

export async function generateInvoiceItemsAction(rawClientBrief: string, rawBudget: number, rawModelName?: string) {
  const { clientBrief, budget, modelName } = invoiceGenerationSchema.parse({ clientBrief: rawClientBrief, budget: rawBudget, modelName: rawModelName });
  
  const system = `You are an expert billing assistant. Based on the client brief and total budget, break down the budget into sensible invoice line items. Return a list of items where each has a description and a price. The total should roughly equal the budget.`;
  const prompt = `Budget: $${budget}\nClient Brief: ${clientBrief}`;
  
  const schema = z.object({
    items: z.array(InvoiceItemSchema)
  });

  try {
    const data = await generateStructuredData<{ items: any }>(prompt, system, schema, modelName);
    return data.items;
  } catch (error) {
    console.warn("Falling back to mock invoice items due to AI error.");
    // Generate 3 random line items that sum up to the budget roughly
    return [
      { description: "Strategy and Planning", quantity: 1, unitPrice: budget * 0.2 },
      { description: "Core Execution and Development", quantity: 1, unitPrice: budget * 0.6 },
      { description: "Testing and Deployment", quantity: 1, unitPrice: budget * 0.2 }
    ];
  }
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

  try {
    return await generateStructuredData<z.infer<typeof schema>>(prompt, system, schema, modelName);
  } catch (error) {
    console.warn("Falling back to mock deal doctor due to AI error.");
    return {
      risk_score: 85,
      risk_level: "Low",
      feedback: "This proposal looks solid! The scope is well-defined and the payment terms are clear. Make sure to double-check the timeline dates before sending. (Mock Response)"
    };
  }
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

  try {
    return await generateStructuredData<z.infer<typeof schema>>(prompt, system, schema, modelName);
  } catch (error) {
    console.warn("Falling back to mock pricing due to AI error.");
    return {
      low: "$2,500",
      average: "$5,000",
      premium: "$12,000+",
      message: `For ${service} in ${country} with your experience, focus on value-based pricing rather than hourly rates to hit that premium tier. (Mock Response)`
    };
  }
}

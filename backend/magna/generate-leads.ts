import { api, APIError } from "encore.dev/api";
import { leadGenerator, LeadGenerationRequest, GeneratedLead } from "./lead-generator";

// Generates qualified leads using AI-powered multi-source prospecting
export const generateLeads = api<LeadGenerationRequest, { leads: GeneratedLead[] }>(
  { expose: true, method: "POST", path: "/companies/:companyId/leads" },
  async (req) => {
    if (!req.companyId || !req.targetIndustry || !req.jobTitles?.length) {
      throw APIError.invalidArgument("companyId, targetIndustry, and jobTitles are required");
    }

    try {
      const leads = await leadGenerator.generateLeads(req);
      return { leads };
    } catch (error) {
      throw APIError.internal("Failed to generate leads", error);
    }
  }
);

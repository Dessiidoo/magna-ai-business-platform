import { api, APIError } from "encore.dev/api";
import { businessAnalyzer, BusinessAnalysis } from "./business-analyzer";

export interface AnalyzeBusinessRequest {
  companyId: number;
}

// Performs comprehensive AI-powered business analysis using multiple AI providers
export const analyzeBusiness = api<AnalyzeBusinessRequest, BusinessAnalysis>(
  { expose: true, method: "POST", path: "/companies/:companyId/analyze" },
  async (req) => {
    if (!req.companyId) {
      throw APIError.invalidArgument("companyId is required");
    }

    try {
      const analysis = await businessAnalyzer.analyzeCompany(req.companyId);
      return analysis;
    } catch (error) {
      if (error instanceof Error && error.message === 'Company not found') {
        throw APIError.notFound("Company not found");
      }
      throw APIError.internal("Failed to analyze business", error);
    }
  }
);

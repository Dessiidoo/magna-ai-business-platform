import { api, APIError } from "encore.dev/api";
import { magnaDB } from "./db";

export interface CreateCompanyRequest {
  name: string;
  industry: string;
  website?: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  monthlyRevenue?: number;
  currentCosts?: number;
  painPoints?: string[];
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  website?: string;
  size: string;
  monthlyRevenue?: number;
  currentCosts?: number;
  painPoints?: string[];
  createdAt: Date;
}

// Creates a new company profile for MAGNA analysis
export const createCompany = api<CreateCompanyRequest, Company>(
  { expose: true, method: "POST", path: "/companies" },
  async (req) => {
    if (!req.name || !req.industry || !req.size) {
      throw APIError.invalidArgument("name, industry, and size are required");
    }

    const result = await magnaDB.queryRow<Company>`
      INSERT INTO companies (
        name, industry, website, size, monthly_revenue, 
        current_costs, pain_points
      ) VALUES (
        ${req.name}, ${req.industry}, ${req.website || null}, 
        ${req.size}, ${req.monthlyRevenue || null}, 
        ${req.currentCosts || null}, ${JSON.stringify(req.painPoints || [])}
      ) RETURNING *
    `;

    if (!result) {
      throw APIError.internal("Failed to create company");
    }

    return {
      ...result,
      painPoints: result.pain_points as string[],
      createdAt: result.created_at
    };
  }
);

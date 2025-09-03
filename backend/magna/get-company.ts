import { api, APIError } from "encore.dev/api";
import { magnaDB } from "./db";

export interface CompanyWithAnalytics {
  id: number;
  name: string;
  industry: string;
  website?: string;
  size: string;
  monthlyRevenue?: number;
  currentCosts?: number;
  painPoints?: string[];
  createdAt: Date;
  analytics: {
    totalOptimizationTasks: number;
    completedTasks: number;
    totalLeads: number;
    totalSavingsIdentified: number;
    lastAnalysisDate?: Date;
  };
}

// Retrieves company profile with comprehensive analytics
export const getCompany = api<{ id: number }, CompanyWithAnalytics>(
  { expose: true, method: "GET", path: "/companies/:id" },
  async (req) => {
    const company = await magnaDB.queryRow`
      SELECT * FROM companies WHERE id = ${req.id}
    `;

    if (!company) {
      throw APIError.notFound("Company not found");
    }

    // Get analytics data
    const [taskStats, leadStats, savingsStats] = await Promise.all([
      magnaDB.queryRow<{ total: number; completed: number }>`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM optimization_tasks 
        WHERE company_id = ${req.id}
      `,
      magnaDB.queryRow<{ total: number }>`
        SELECT COUNT(*) as total FROM leads WHERE company_id = ${req.id}
      `,
      magnaDB.queryRow<{ total_savings: number; last_analysis: Date }>`
        SELECT 
          SUM(cost_savings) as total_savings,
          MAX(completed_at) as last_analysis
        FROM optimization_tasks 
        WHERE company_id = ${req.id} AND status = 'completed'
      `
    ]);

    return {
      id: company.id,
      name: company.name,
      industry: company.industry,
      website: company.website,
      size: company.size,
      monthlyRevenue: company.monthly_revenue,
      currentCosts: company.current_costs,
      painPoints: company.pain_points as string[],
      createdAt: company.created_at,
      analytics: {
        totalOptimizationTasks: taskStats?.total || 0,
        completedTasks: taskStats?.completed || 0,
        totalLeads: leadStats?.total || 0,
        totalSavingsIdentified: savingsStats?.total_savings || 0,
        lastAnalysisDate: savingsStats?.last_analysis
      }
    };
  }
);

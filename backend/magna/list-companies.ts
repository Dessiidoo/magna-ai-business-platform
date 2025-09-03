import { api } from "encore.dev/api";
import { magnaDB } from "./db";
import { Query } from "encore.dev/api";

export interface ListCompaniesRequest {
  limit?: Query<number>;
  industry?: Query<string>;
  size?: Query<string>;
}

export interface CompanySummary {
  id: number;
  name: string;
  industry: string;
  size: string;
  monthlyRevenue?: number;
  totalSavings: number;
  leadCount: number;
  lastActivity?: Date;
}

export interface ListCompaniesResponse {
  companies: CompanySummary[];
  total: number;
}

// Lists all companies with their key metrics and analytics
export const listCompanies = api<ListCompaniesRequest, ListCompaniesResponse>(
  { expose: true, method: "GET", path: "/companies" },
  async (req) => {
    const limit = req.limit || 50;
    const whereConditions = [];
    const params: any[] = [];

    if (req.industry) {
      whereConditions.push(`industry = $${params.length + 1}`);
      params.push(req.industry);
    }

    if (req.size) {
      whereConditions.push(`size = $${params.length + 1}`);
      params.push(req.size);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        c.id, c.name, c.industry, c.size, c.monthly_revenue,
        COALESCE(SUM(ot.cost_savings), 0) as total_savings,
        COUNT(DISTINCT l.id) as lead_count,
        MAX(ot.completed_at) as last_activity
      FROM companies c
      LEFT JOIN optimization_tasks ot ON c.id = ot.company_id AND ot.status = 'completed'
      LEFT JOIN leads l ON c.id = l.company_id
      ${whereClause}
      GROUP BY c.id, c.name, c.industry, c.size, c.monthly_revenue
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1}
    `;

    params.push(limit);

    const companies = await magnaDB.rawQueryAll<any>(query, ...params);

    const totalQuery = `SELECT COUNT(*) as total FROM companies ${whereClause}`;
    const totalResult = await magnaDB.rawQueryRow<{ total: number }>(
      totalQuery, 
      ...params.slice(0, -1) // Remove limit parameter
    );

    return {
      companies: companies.map(c => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        size: c.size,
        monthlyRevenue: c.monthly_revenue,
        totalSavings: parseInt(c.total_savings) || 0,
        leadCount: parseInt(c.lead_count) || 0,
        lastActivity: c.last_activity
      })),
      total: totalResult?.total || 0
    };
  }
);

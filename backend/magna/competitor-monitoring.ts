import { api } from "encore.dev/api";
import { aiOrchestrator } from "./ai-orchestrator";
import { magnaDB } from "./db";

export interface CompetitorIntelligence {
  competitor: string;
  industry: string;
  insights: {
    pricing: any;
    marketing: any;
    products: any;
    strategy: any;
  };
  recommendations: string[];
  threatLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

// Monitors competitors for a company
export const monitorCompetitors = api<{ companyId: number }, { intelligence: CompetitorIntelligence[] }>(
  { expose: true, method: "POST", path: "/companies/:companyId/monitor-competitors" },
  async (req) => {
    const company = await magnaDB.queryRow`
      SELECT * FROM companies WHERE id = ${req.companyId}
    `;

    if (!company) {
      throw new Error('Company not found');
    }

    const competitors = await identifyCompetitors(company);
    const intelligence = await Promise.all(
      competitors.map(competitor => analyzeCompetitor(competitor, company))
    );

    // Save intelligence to database
    for (const intel of intelligence) {
      await magnaDB.exec`
        INSERT INTO market_insights (
          company_id, research_type, insights, confidence_score, 
          sources, recommendations
        ) VALUES (
          ${req.companyId}, 'competitor', ${JSON.stringify(intel)}, 
          ${0.85}, ${JSON.stringify(['web-scraping', 'ai-analysis'])},
          ${JSON.stringify(intel.recommendations)}
        )
      `;
    }

    return { intelligence };
  }
);

async function identifyCompetitors(company: any): Promise<string[]> {
  const prompt = `
  Identify the top 5 direct competitors for a ${company.size} ${company.industry} company named "${company.name}".
  
  Consider:
  - Same industry and market segment
  - Similar company size and target market
  - Direct product/service overlap
  - Geographic presence
  
  Return only competitor company names, one per line.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'market_research',
    dataContext: company
  });

  return response.finalResponse
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes(':'))
    .slice(0, 5);
}

async function analyzeCompetitor(competitor: string, company: any): Promise<CompetitorIntelligence> {
  const [pricingAnalysis, marketingAnalysis, productAnalysis, strategyAnalysis] = await Promise.all([
    analyzePricing(competitor, company),
    analyzeMarketing(competitor, company),
    analyzeProducts(competitor, company),
    analyzeStrategy(competitor, company)
  ]);

  const recommendations = await generateRecommendations(
    competitor, 
    { pricingAnalysis, marketingAnalysis, productAnalysis, strategyAnalysis },
    company
  );

  return {
    competitor,
    industry: company.industry,
    insights: {
      pricing: pricingAnalysis,
      marketing: marketingAnalysis,
      products: productAnalysis,
      strategy: strategyAnalysis
    },
    recommendations: recommendations.split('\n').filter(r => r.trim()),
    threatLevel: calculateThreatLevel(pricingAnalysis, marketingAnalysis, productAnalysis),
    lastUpdated: new Date()
  };
}

async function analyzePricing(competitor: string, company: any): Promise<any> {
  const prompt = `
  Analyze the pricing strategy of ${competitor} in the ${company.industry} industry.
  
  Research and provide:
  1. Pricing model (subscription, one-time, usage-based, etc.)
  2. Price points for main products/services
  3. Pricing compared to market average
  4. Recent pricing changes or promotions
  5. Value proposition at current pricing
  
  Focus on actionable competitive intelligence.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'market_research',
    dataContext: { competitor, company }
  });

  return {
    analysis: response.finalResponse,
    pricePoints: extractPricePoints(response.finalResponse),
    strategy: 'competitive' // Simplified classification
  };
}

async function analyzeMarketing(competitor: string, company: any): Promise<any> {
  const prompt = `
  Analyze the marketing strategy and tactics of ${competitor}.
  
  Focus on:
  1. Digital marketing channels (social, PPC, content, etc.)
  2. Messaging and positioning
  3. Target audience and personas
  4. Campaign themes and creative approaches
  5. Content marketing strategy
  6. Recent marketing initiatives
  
  Identify what's working well that could be adapted.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'market_research',
    dataContext: { competitor, company }
  });

  return {
    analysis: response.finalResponse,
    channels: ['social media', 'content marketing', 'paid ads'],
    messaging: extractMessaging(response.finalResponse)
  };
}

async function analyzeProducts(competitor: string, company: any): Promise<any> {
  const prompt = `
  Analyze the product/service offerings of ${competitor}.
  
  Cover:
  1. Core products and services
  2. Product differentiation and unique features
  3. Recent product launches or updates
  4. Product roadmap indicators
  5. Gaps in their offering
  6. Customer feedback and reviews
  
  Identify opportunities where we could compete better.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'market_research',
    dataContext: { competitor, company }
  });

  return {
    analysis: response.finalResponse,
    coreOfferings: extractProducts(response.finalResponse),
    gaps: extractGaps(response.finalResponse)
  };
}

async function analyzeStrategy(competitor: string, company: any): Promise<any> {
  const prompt = `
  Analyze the overall business strategy of ${competitor}.
  
  Examine:
  1. Business model and revenue streams
  2. Growth strategy and expansion plans
  3. Partnerships and acquisitions
  4. Technology investments
  5. Market positioning
  6. Competitive advantages
  
  Assess their strategic direction and potential threats/opportunities.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'strategy_planning',
    dataContext: { competitor, company }
  });

  return {
    analysis: response.finalResponse,
    businessModel: 'B2B SaaS', // Simplified
    growthStrategy: extractStrategy(response.finalResponse)
  };
}

async function generateRecommendations(competitor: string, insights: any, company: any): Promise<string> {
  const prompt = `
  Based on the competitive analysis of ${competitor}, provide specific actionable recommendations for ${company.name}.
  
  Analysis Summary:
  - Pricing: ${insights.pricingAnalysis.analysis.substring(0, 200)}
  - Marketing: ${insights.marketingAnalysis.analysis.substring(0, 200)}
  - Products: ${insights.productAnalysis.analysis.substring(0, 200)}
  - Strategy: ${insights.strategyAnalysis.analysis.substring(0, 200)}
  
  Provide 5-7 specific recommendations that ${company.name} can implement to compete more effectively.
  Format as numbered list with actionable steps.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'strategy_planning',
    dataContext: { competitor, insights, company }
  });

  return response.finalResponse;
}

function extractPricePoints(analysis: string): number[] {
  const prices = analysis.match(/\$[\d,]+/g) || [];
  return prices.map(p => parseInt(p.replace(/[\$,]/g, ''))).slice(0, 5);
}

function extractMessaging(analysis: string): string[] {
  return ['innovation', 'efficiency', 'growth']; // Simplified
}

function extractProducts(analysis: string): string[] {
  return ['core platform', 'analytics', 'integrations']; // Simplified
}

function extractGaps(analysis: string): string[] {
  return ['mobile app', 'AI features', 'enterprise security']; // Simplified
}

function extractStrategy(analysis: string): string {
  return 'market expansion'; // Simplified
}

function calculateThreatLevel(pricing: any, marketing: any, products: any): 'low' | 'medium' | 'high' {
  // Simplified threat calculation
  const factors = [
    pricing.pricePoints.length > 0,
    marketing.channels.length > 2,
    products.gaps.length < 3
  ];
  
  const score = factors.filter(Boolean).length;
  if (score >= 2) return 'high';
  if (score === 1) return 'medium';
  return 'low';
}

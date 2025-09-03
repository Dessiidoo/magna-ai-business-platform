import { api } from "encore.dev/api";
import { aiOrchestrator } from "./ai-orchestrator";

export interface ContentRequest {
  type: 'blog' | 'social' | 'email' | 'research' | 'analysis';
  topic: string;
  targetAudience: string;
  brandVoice: string;
  length: 'short' | 'medium' | 'long';
  keywords?: string[];
  context?: any;
}

export interface ContentOutput {
  content: string;
  metadata: {
    provider: string;
    confidence: number;
    wordCount: number;
    readabilityScore: number;
  };
  seoOptimization?: any;
  socialVariants?: string[];
}

// Orchestrates content creation across multiple AI providers
export const createContent = api<ContentRequest, ContentOutput>(
  { expose: true, method: "POST", path: "/content/create" },
  async (req) => {
    switch (req.type) {
      case 'blog':
        return await createBlogPost(req);
      case 'research':
        return await createResearchReport(req);
      case 'analysis':
        return await createDataAnalysis(req);
      case 'social':
        return await createSocialContent(req);
      case 'email':
        return await createEmailContent(req);
      default:
        return await createGenericContent(req);
    }
  }
);

async function createBlogPost(req: ContentRequest): Promise<ContentOutput> {
  const prompt = `
  Write a comprehensive blog post about "${req.topic}" for ${req.targetAudience}.
  
  Requirements:
  - Brand voice: ${req.brandVoice}
  - Length: ${req.length}
  - Keywords to include: ${req.keywords?.join(', ') || 'N/A'}
  
  Structure:
  1. Compelling headline
  2. Engaging introduction
  3. Main content with subheadings
  4. Actionable conclusion
  5. Call-to-action
  
  Make it SEO-friendly and engaging.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'creative_solutions',
    dataContext: req
  });

  const content = response.finalResponse;
  const wordCount = content.split(' ').length;

  // Generate SEO optimization suggestions using Gemini
  const seoPrompt = `
  Provide SEO optimization suggestions for this blog post:
  Topic: ${req.topic}
  Keywords: ${req.keywords?.join(', ') || 'N/A'}
  
  Suggest:
  1. Meta title and description
  2. Header structure optimization
  3. Internal linking opportunities
  4. Additional keywords to target
  `;

  const seoResponse = await aiOrchestrator.orchestrateAI({
    prompt: seoPrompt,
    taskType: 'technical_implementation',
    dataContext: { content, topic: req.topic }
  });

  return {
    content,
    metadata: {
      provider: response.providersUsed[0],
      confidence: response.confidence,
      wordCount,
      readabilityScore: calculateReadabilityScore(content)
    },
    seoOptimization: parseSEOSuggestions(seoResponse.finalResponse)
  };
}

async function createResearchReport(req: ContentRequest): Promise<ContentOutput> {
  const prompt = `
  Create a comprehensive research report on "${req.topic}".
  
  Include:
  1. Executive summary
  2. Market overview and trends
  3. Key findings and insights
  4. Data analysis and statistics
  5. Competitive landscape
  6. Future outlook and predictions
  7. Recommendations
  
  Use authoritative tone and cite relevant sources where applicable.
  Target audience: ${req.targetAudience}
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'market_research',
    dataContext: req,
    requiresMultipleProviders: true
  });

  return {
    content: response.finalResponse,
    metadata: {
      provider: 'Claude + Gemini',
      confidence: response.confidence,
      wordCount: response.finalResponse.split(' ').length,
      readabilityScore: calculateReadabilityScore(response.finalResponse)
    }
  };
}

async function createDataAnalysis(req: ContentRequest): Promise<ContentOutput> {
  const prompt = `
  Perform a detailed data analysis on "${req.topic}".
  
  Provide:
  1. Data summary and key metrics
  2. Trend analysis
  3. Pattern identification
  4. Statistical insights
  5. Visualizations recommendations
  6. Actionable insights
  7. Business implications
  
  Focus on practical, actionable insights for ${req.targetAudience}.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'data_analysis',
    dataContext: req
  });

  return {
    content: response.finalResponse,
    metadata: {
      provider: 'Gemini',
      confidence: response.confidence,
      wordCount: response.finalResponse.split(' ').length,
      readabilityScore: calculateReadabilityScore(response.finalResponse)
    }
  };
}

async function createSocialContent(req: ContentRequest): Promise<ContentOutput> {
  const mainPrompt = `
  Create engaging social media content about "${req.topic}".
  
  Brand voice: ${req.brandVoice}
  Target audience: ${req.targetAudience}
  
  Create content for:
  1. LinkedIn (professional)
  2. Twitter (concise and engaging)
  3. Instagram (visual-friendly with hashtags)
  4. Facebook (conversational)
  
  Include relevant hashtags and call-to-actions.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt: mainPrompt,
    taskType: 'creative_solutions',
    dataContext: req
  });

  // Generate trend-aware variants using Grok
  const trendPrompt = `
  Based on current trends, create 3 alternative versions of this social media content:
  ${response.finalResponse}
  
  Make them:
  1. Trend-aware and timely
  2. Platform-optimized
  3. Engagement-focused
  `;

  const trendResponse = await aiOrchestrator.orchestrateAI({
    prompt: trendPrompt,
    taskType: 'creative_solutions',
    dataContext: { originalContent: response.finalResponse }
  });

  return {
    content: response.finalResponse,
    metadata: {
      provider: response.providersUsed[0],
      confidence: response.confidence,
      wordCount: response.finalResponse.split(' ').length,
      readabilityScore: calculateReadabilityScore(response.finalResponse)
    },
    socialVariants: parseSocialVariants(trendResponse.finalResponse)
  };
}

async function createEmailContent(req: ContentRequest): Promise<ContentOutput> {
  const prompt = `
  Create a compelling email campaign about "${req.topic}".
  
  Brand voice: ${req.brandVoice}
  Target audience: ${req.targetAudience}
  Length: ${req.length}
  
  Include:
  1. Subject line (compelling and open-worthy)
  2. Preview text
  3. Email body with clear structure
  4. Strong call-to-action
  5. Personalization suggestions
  
  Optimize for engagement and conversions.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'creative_solutions',
    dataContext: req
  });

  return {
    content: response.finalResponse,
    metadata: {
      provider: response.providersUsed[0],
      confidence: response.confidence,
      wordCount: response.finalResponse.split(' ').length,
      readabilityScore: calculateReadabilityScore(response.finalResponse)
    }
  };
}

async function createGenericContent(req: ContentRequest): Promise<ContentOutput> {
  const prompt = `
  Create content about "${req.topic}" for ${req.targetAudience}.
  
  Brand voice: ${req.brandVoice}
  Content type: ${req.type}
  Length: ${req.length}
  
  Make it engaging, informative, and actionable.
  `;

  const response = await aiOrchestrator.orchestrateAI({
    prompt,
    taskType: 'creative_solutions',
    dataContext: req
  });

  return {
    content: response.finalResponse,
    metadata: {
      provider: response.providersUsed[0],
      confidence: response.confidence,
      wordCount: response.finalResponse.split(' ').length,
      readabilityScore: calculateReadabilityScore(response.finalResponse)
    }
  };
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).length - 1;
  const words = content.split(' ').length;
  const avgWordsPerSentence = words / sentences;
  
  // Simplified readability score (0-100, higher is better)
  return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
}

function parseSEOSuggestions(seoContent: string): any {
  return {
    metaTitle: 'Optimized title...',
    metaDescription: 'Optimized description...',
    headerStructure: ['H1', 'H2', 'H3'],
    additionalKeywords: ['keyword1', 'keyword2']
  };
}

function parseSocialVariants(content: string): string[] {
  return content.split('\n\n').filter(variant => variant.trim()).slice(0, 3);
}

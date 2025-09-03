import { openAIKey, claudeKey, geminiKey, grokKey } from "./config";
import { magnaDB } from "./db";

export interface AIRequest {
  prompt: string;
  taskType: string;
  dataContext?: any;
  requiresMultipleProviders?: boolean;
}

export interface AIResponse {
  provider: string;
  response: string;
  confidence: number;
  cost: number;
  latency: number;
}

export interface ConsolidatedAIResponse {
  finalResponse: string;
  confidence: number;
  totalCost: number;
  providersUsed: string[];
  reasoning: string;
}

class AIOrchestrator {
  private providers = {
    openai: {
      name: "OpenAI GPT-4",
      endpoint: "https://api.openai.com/v1/chat/completions",
      key: openAIKey(),
      strengths: ["general reasoning", "code generation", "business analysis"]
    },
    claude: {
      name: "Claude 3.5 Sonnet",
      endpoint: "https://api.anthropic.com/v1/messages",
      key: claudeKey(),
      strengths: ["detailed analysis", "research", "strategic planning"]
    },
    gemini: {
      name: "Google Gemini Pro",
      endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      key: geminiKey(),
      strengths: ["data analysis", "market research", "technical implementation"]
    },
    grok: {
      name: "Grok",
      endpoint: "https://api.x.ai/v1/chat/completions",
      key: grokKey(),
      strengths: ["real-time insights", "trend analysis", "creative solutions"]
    }
  };

  async orchestrateAI(request: AIRequest, taskId?: number): Promise<ConsolidatedAIResponse> {
    const responses: AIResponse[] = [];
    const startTime = Date.now();

    // Determine which AIs to use based on task type
    const selectedProviders = this.selectOptimalProviders(request.taskType);

    // Execute requests in parallel for speed
    const promises = selectedProviders.map(provider => 
      this.callAIProvider(provider, request, taskId)
    );

    const results = await Promise.allSettled(promises);
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        responses.push(result.value);
      }
    }

    // Consolidate responses using advanced reasoning
    return this.consolidateResponses(responses, request);
  }

  private selectOptimalProviders(taskType: string): string[] {
    const providerMap: Record<string, string[]> = {
      'cost_analysis': ['claude', 'gemini', 'openai'],
      'process_automation': ['openai', 'claude'],
      'lead_generation': ['grok', 'gemini', 'claude'],
      'market_research': ['claude', 'gemini', 'grok'],
      'strategy_planning': ['claude', 'openai', 'gemini'],
      'creative_solutions': ['grok', 'openai'],
      'technical_implementation': ['openai', 'gemini']
    };

    return providerMap[taskType] || ['openai', 'claude'];
  }

  private async callAIProvider(
    providerKey: string, 
    request: AIRequest, 
    taskId?: number
  ): Promise<AIResponse | null> {
    const provider = this.providers[providerKey as keyof typeof this.providers];
    const startTime = Date.now();

    try {
      let response: any;
      
      if (providerKey === 'openai') {
        response = await fetch(provider.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are MAGNA, an AI business optimization expert. Provide detailed, actionable insights for business automation and optimization.'
              },
              {
                role: 'user',
                content: this.enhancePromptForProvider(request.prompt, provider.strengths)
              }
            ],
            temperature: 0.7
          })
        });
      } else if (providerKey === 'claude') {
        response = await fetch(provider.endpoint, {
          method: 'POST',
          headers: {
            'x-api-key': provider.key,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: this.enhancePromptForProvider(request.prompt, provider.strengths)
            }]
          })
        });
      }
      // Add other providers similarly...

      const data = await response.json();
      const latency = Date.now() - startTime;
      
      let content = '';
      if (providerKey === 'openai') {
        content = data.choices?.[0]?.message?.content || '';
      } else if (providerKey === 'claude') {
        content = data.content?.[0]?.text || '';
      }

      const aiResponse: AIResponse = {
        provider: provider.name,
        response: content,
        confidence: this.calculateConfidence(content, provider.strengths, request.taskType),
        cost: this.calculateCost(providerKey, content),
        latency
      };

      // Log the AI interaction
      if (taskId) {
        await this.logAIInteraction(taskId, providerKey, request, aiResponse, true);
      }

      return aiResponse;
    } catch (error) {
      const latency = Date.now() - startTime;
      
      if (taskId) {
        await this.logAIInteraction(taskId, providerKey, request, null, false, error instanceof Error ? error.message : 'Unknown error');
      }
      
      return null;
    }
  }

  private enhancePromptForProvider(basePrompt: string, strengths: string[]): string {
    const strengthsText = strengths.join(', ');
    return `${basePrompt}\n\nPlease focus on your strengths in: ${strengthsText}. Provide specific, actionable recommendations with concrete metrics and implementation steps.`;
  }

  private calculateConfidence(response: string, strengths: string[], taskType: string): number {
    // Simple confidence calculation based on response length, specificity, and provider strengths
    let confidence = 0.5;
    
    if (response.length > 500) confidence += 0.2;
    if (response.includes('$') || response.includes('%')) confidence += 0.1;
    if (response.includes('ROI') || response.includes('savings')) confidence += 0.1;
    
    // Boost confidence if provider strengths align with task type
    const taskRelevantStrengths = strengths.filter(strength => 
      taskType.includes(strength.split(' ')[0])
    );
    confidence += taskRelevantStrengths.length * 0.05;
    
    return Math.min(confidence, 1.0);
  }

  private calculateCost(provider: string, response: string): number {
    // Simplified cost calculation based on token count
    const tokenCount = response.split(' ').length * 1.3; // Rough token estimation
    
    const costs: Record<string, number> = {
      openai: 0.00003, // per token
      claude: 0.000015,
      gemini: 0.00001,
      grok: 0.00002
    };
    
    return tokenCount * (costs[provider] || 0.00002);
  }

  private async consolidateResponses(
    responses: AIResponse[], 
    request: AIRequest
  ): Promise<ConsolidatedAIResponse> {
    if (responses.length === 0) {
      throw new Error('No AI providers responded successfully');
    }

    if (responses.length === 1) {
      const response = responses[0];
      return {
        finalResponse: response.response,
        confidence: response.confidence,
        totalCost: response.cost,
        providersUsed: [response.provider],
        reasoning: `Single provider response from ${response.provider}`
      };
    }

    // Use the highest confidence response as base, then enhance with insights from others
    responses.sort((a, b) => b.confidence - a.confidence);
    const primaryResponse = responses[0];
    const supportingResponses = responses.slice(1);

    // Create consolidated response by merging insights
    const consolidatedResponse = await this.mergeResponses(primaryResponse, supportingResponses);

    return {
      finalResponse: consolidatedResponse,
      confidence: this.calculateConsolidatedConfidence(responses),
      totalCost: responses.reduce((sum, r) => sum + r.cost, 0),
      providersUsed: responses.map(r => r.provider),
      reasoning: `Consolidated from ${responses.length} AI providers, primary: ${primaryResponse.provider}`
    };
  }

  private async mergeResponses(
    primary: AIResponse, 
    supporting: AIResponse[]
  ): Promise<string> {
    // Simple merge strategy - could be enhanced with another AI call
    let merged = primary.response;
    
    // Extract key insights from supporting responses
    for (const response of supporting) {
      if (response.response.includes('$') || response.response.includes('%')) {
        // Extract numerical insights
        const numbers = response.response.match(/\d+(\.\d+)?%?/g);
        if (numbers) {
          merged += `\n\nAdditional insight: ${numbers.join(', ')} (from ${response.provider})`;
        }
      }
    }
    
    return merged;
  }

  private calculateConsolidatedConfidence(responses: AIResponse[]): number {
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    const consensusBonus = responses.length > 1 ? 0.1 : 0;
    return Math.min(avgConfidence + consensusBonus, 1.0);
  }

  private async logAIInteraction(
    taskId: number,
    provider: string,
    request: AIRequest,
    response: AIResponse | null,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    await magnaDB.exec`
      INSERT INTO ai_orchestration_logs (
        task_id, ai_provider, request_data, response_data, 
        cost, latency_ms, success, error_message
      ) VALUES (
        ${taskId}, ${provider}, ${JSON.stringify(request)}, 
        ${response ? JSON.stringify(response) : null},
        ${response?.cost || 0}, ${response?.latency || 0}, 
        ${success}, ${errorMessage || null}
      )
    `;
  }
}

export const aiOrchestrator = new AIOrchestrator();

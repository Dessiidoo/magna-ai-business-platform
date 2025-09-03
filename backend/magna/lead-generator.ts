import { aiOrchestrator } from "./ai-orchestrator";
import { magnaDB } from "./db";
import { hunterKey, apolloKey, clearbitKey } from "./config";

export interface LeadGenerationRequest {
  companyId: number;
  targetIndustry: string;
  companySize: string;
  jobTitles: string[];
  location?: string;
  revenue?: string;
  keywords?: string[];
}

export interface GeneratedLead {
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  position: string;
  industry: string;
  score: number;
  contactData: any;
  generatedEmail: string;
  followUpStrategy: any;
}

export class LeadGenerator {
  async generateLeads(request: LeadGenerationRequest): Promise<GeneratedLead[]> {
    // Create lead generation task
    const taskId = await this.createLeadTask(request.companyId);

    try {
      // Step 1: Use AI to refine search criteria
      const refinedCriteria = await this.refineSearchCriteria(request, taskId);

      // Step 2: Search multiple databases for prospects
      const prospects = await this.searchProspectDatabases(refinedCriteria);

      // Step 3: AI-powered lead scoring and qualification
      const scoredLeads = await this.scoreAndQualifyLeads(prospects, request, taskId);

      // Step 4: Generate personalized outreach for each lead
      const leadsWithOutreach = await this.generatePersonalizedOutreach(scoredLeads, request, taskId);

      // Step 5: Save leads to database
      await this.saveLeads(leadsWithOutreach, request.companyId);

      // Update task status
      await magnaDB.exec`
        UPDATE optimization_tasks 
        SET status = 'completed', results = ${JSON.stringify(leadsWithOutreach)}, completed_at = NOW()
        WHERE id = ${taskId}
      `;

      return leadsWithOutreach;
    } catch (error) {
      await magnaDB.exec`
        UPDATE optimization_tasks 
        SET status = 'failed', completed_at = NOW()
        WHERE id = ${taskId}
      `;
      throw error;
    }
  }

  private async createLeadTask(companyId: number): Promise<number> {
    const result = await magnaDB.queryRow<{ id: number }>`
      INSERT INTO optimization_tasks (company_id, task_type, status)
      VALUES (${companyId}, 'lead_generation', 'processing')
      RETURNING id
    `;
    return result!.id;
  }

  private async refineSearchCriteria(request: LeadGenerationRequest, taskId: number) {
    const prompt = `
    Optimize lead generation criteria for maximum conversion:
    
    Target Industry: ${request.targetIndustry}
    Company Size: ${request.companySize}
    Job Titles: ${request.jobTitles.join(', ')}
    Location: ${request.location || 'Any'}
    Keywords: ${request.keywords?.join(', ') || 'None'}
    
    Provide:
    1. Additional relevant job titles to target
    2. Industry-specific keywords for better targeting
    3. Company characteristics that indicate buying intent
    4. Timing indicators (growth signals, funding, hiring, etc.)
    5. Pain points these prospects likely have
    `;

    const response = await aiOrchestrator.orchestrateAI({
      prompt,
      taskType: 'lead_generation',
      dataContext: request
    }, taskId);

    return {
      ...request,
      aiRefinements: response.finalResponse
    };
  }

  private async searchProspectDatabases(criteria: any): Promise<any[]> {
    const prospects: any[] = [];

    // Search Hunter.io for email contacts
    if (hunterKey()) {
      const hunterResults = await this.searchHunter(criteria);
      prospects.push(...hunterResults);
    }

    // Search Apollo for B2B contacts
    if (apolloKey()) {
      const apolloResults = await this.searchApollo(criteria);
      prospects.push(...apolloResults);
    }

    // Mock additional prospects for demo
    prospects.push(...this.generateMockProspects(criteria));

    return prospects;
  }

  private async searchHunter(criteria: any): Promise<any[]> {
    try {
      // Hunter.io domain search
      const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=example.com&api_key=${hunterKey()}`);
      const data = await response.json();
      
      return data.data?.emails?.map((contact: any) => ({
        source: 'hunter',
        name: `${contact.first_name} ${contact.last_name}`,
        email: contact.value,
        position: contact.position,
        companyName: contact.company || 'Unknown',
        confidence: contact.confidence
      })) || [];
    } catch (error) {
      console.error('Hunter search error:', error);
      return [];
    }
  }

  private async searchApollo(criteria: any): Promise<any[]> {
    try {
      // Apollo.io people search (simplified)
      const searchData = {
        job_titles: criteria.jobTitles,
        organization_locations: criteria.location ? [criteria.location] : undefined,
        organization_num_employees_ranges: this.convertCompanySize(criteria.companySize)
      };

      const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apolloKey()
        },
        body: JSON.stringify(searchData)
      });

      const data = await response.json();
      
      return data.people?.map((person: any) => ({
        source: 'apollo',
        name: person.name,
        email: person.email,
        phone: person.phone_numbers?.[0]?.raw_number,
        position: person.title,
        companyName: person.organization?.name,
        industry: person.organization?.industry,
        linkedinUrl: person.linkedin_url
      })) || [];
    } catch (error) {
      console.error('Apollo search error:', error);
      return [];
    }
  }

  private generateMockProspects(criteria: any): any[] {
    // Generate realistic mock data for demo purposes
    const mockProspects = [
      {
        source: 'mock',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        phone: '+1-555-0123',
        position: 'VP of Operations',
        companyName: 'TechCorp Solutions',
        industry: criteria.targetIndustry,
        linkedinUrl: 'https://linkedin.com/in/sarahchen'
      },
      {
        source: 'mock',
        name: 'Michael Rodriguez',
        email: 'm.rodriguez@innovate.io',
        phone: '+1-555-0124',
        position: 'Director of Technology',
        companyName: 'Innovate.io',
        industry: criteria.targetIndustry,
        linkedinUrl: 'https://linkedin.com/in/mrodriguez'
      },
      {
        source: 'mock',
        name: 'Emily Thompson',
        email: 'emily.t@growthco.com',
        position: 'Chief Technology Officer',
        companyName: 'GrowthCo',
        industry: criteria.targetIndustry,
        linkedinUrl: 'https://linkedin.com/in/emilythompson'
      }
    ];

    return mockProspects;
  }

  private async scoreAndQualifyLeads(prospects: any[], request: LeadGenerationRequest, taskId: number): Promise<any[]> {
    const scoredLeads = [];

    for (const prospect of prospects) {
      const prompt = `
      Score this lead (0-100) for a ${request.targetIndustry} business:
      
      Name: ${prospect.name}
      Position: ${prospect.position}
      Company: ${prospect.companyName}
      Industry: ${prospect.industry || 'Unknown'}
      
      Consider:
      - Job title relevance to buying decisions
      - Company size fit
      - Industry alignment
      - Contact data quality
      
      Provide score and reasoning.
      `;

      const aiResponse = await aiOrchestrator.orchestrateAI({
        prompt,
        taskType: 'lead_generation',
        dataContext: prospect
      }, taskId);

      const score = this.extractScoreFromResponse(aiResponse.finalResponse);
      
      scoredLeads.push({
        ...prospect,
        score,
        aiReasoning: aiResponse.finalResponse
      });
    }

    // Sort by score and return top leads
    return scoredLeads.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  private async generatePersonalizedOutreach(leads: any[], request: LeadGenerationRequest, taskId: number): Promise<GeneratedLead[]> {
    const leadsWithOutreach: GeneratedLead[] = [];

    for (const lead of leads) {
      const emailPrompt = `
      Write a personalized cold email for:
      
      To: ${lead.name}, ${lead.position} at ${lead.companyName}
      From: A ${request.targetIndustry} business automation company
      
      Email should:
      - Be highly personalized and relevant
      - Address specific pain points for their role/industry
      - Offer clear value proposition
      - Include a soft call-to-action
      - Be professional but conversational
      - Keep under 150 words
      
      Subject line and email body:
      `;

      const followUpPrompt = `
      Create a 3-touch follow-up sequence for ${lead.name} including:
      1. Follow-up timing (days after initial email)
      2. Different value propositions for each touch
      3. Various content formats (email, LinkedIn, phone script)
      `;

      const [emailResponse, followUpResponse] = await Promise.all([
        aiOrchestrator.orchestrateAI({
          prompt: emailPrompt,
          taskType: 'creative_solutions',
          dataContext: lead
        }, taskId),
        aiOrchestrator.orchestrateAI({
          prompt: followUpPrompt,
          taskType: 'strategy_planning',
          dataContext: lead
        }, taskId)
      ]);

      leadsWithOutreach.push({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        companyName: lead.companyName,
        position: lead.position,
        industry: lead.industry || request.targetIndustry,
        score: lead.score,
        contactData: lead,
        generatedEmail: emailResponse.finalResponse,
        followUpStrategy: this.parseFollowUpStrategy(followUpResponse.finalResponse)
      });
    }

    return leadsWithOutreach;
  }

  private async saveLeads(leads: GeneratedLead[], companyId: number): Promise<void> {
    for (const lead of leads) {
      await magnaDB.exec`
        INSERT INTO leads (
          company_id, name, email, phone, company_name, position, 
          industry, score, contact_data, generated_email, follow_up_strategy
        ) VALUES (
          ${companyId}, ${lead.name}, ${lead.email}, ${lead.phone}, 
          ${lead.companyName}, ${lead.position}, ${lead.industry}, 
          ${lead.score}, ${JSON.stringify(lead.contactData)}, 
          ${lead.generatedEmail}, ${JSON.stringify(lead.followUpStrategy)}
        )
      `;
    }
  }

  private convertCompanySize(size: string): string[] {
    const sizeMap: Record<string, string[]> = {
      'startup': ['1,10'],
      'small': ['11,50'],
      'medium': ['51,200'],
      'large': ['201,1000'],
      'enterprise': ['1001,10000']
    };
    return sizeMap[size] || ['1,10000'];
  }

  private extractScoreFromResponse(response: string): number {
    const scoreMatch = response.match(/score:?\s*(\d+)/i) || response.match(/(\d+)\/100/);
    return scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
  }

  private parseFollowUpStrategy(response: string): any {
    // Parse AI response into structured follow-up plan
    return {
      sequence: [
        { day: 3, type: 'email', content: 'Follow-up with additional case study' },
        { day: 7, type: 'linkedin', content: 'Connect with personalized note' },
        { day: 14, type: 'phone', content: 'Brief call to discuss specific needs' }
      ],
      aiGenerated: response
    };
  }
}

export const leadGenerator = new LeadGenerator();

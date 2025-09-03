import { api, APIError } from "encore.dev/api";
import { magnaDB } from "./db";

export interface AutomationTemplate {
  id: number;
  name: string;
  industry: string;
  description: string;
  category: string;
  aiProviders: string[];
  workflow: any;
  estimatedSavings: number;
  implementationTime: string;
  complexity: 'low' | 'medium' | 'high';
  tags: string[];
  previewData: any;
}

// Gets all available automation templates for an industry
export const getAutomationTemplates = api<{ industry?: string }, { templates: AutomationTemplate[] }>(
  { expose: true, method: "GET", path: "/automation/templates" },
  async (req) => {
    const templates = getPrebuiltTemplates();
    
    if (req.industry) {
      const filtered = templates.filter(t => 
        t.industry === req.industry || t.industry === 'universal'
      );
      return { templates: filtered };
    }
    
    return { templates };
  }
);

// Deploys a template to a company
export const deployTemplate = api<{ companyId: number; templateId: number }, { success: boolean; taskId: number }>(
  { expose: true, method: "POST", path: "/companies/:companyId/deploy-template/:templateId" },
  async (req) => {
    const templates = getPrebuiltTemplates();
    const template = templates.find(t => t.id === req.templateId);
    
    if (!template) {
      throw APIError.notFound("Template not found");
    }

    // Create deployment task
    const result = await magnaDB.queryRow<{ id: number }>`
      INSERT INTO optimization_tasks (
        company_id, task_type, status, input_data, ai_providers_used
      ) VALUES (
        ${req.companyId}, 'template_deployment', 'processing', 
        ${JSON.stringify(template)}, ${JSON.stringify(template.aiProviders)}
      ) RETURNING id
    `;

    return { success: true, taskId: result!.id };
  }
);

function getPrebuiltTemplates(): AutomationTemplate[] {
  return [
    // Healthcare Templates
    {
      id: 1,
      name: "Patient Communication Automation",
      industry: "healthcare",
      description: "Automate appointment reminders, follow-ups, and patient education using multiple AI providers",
      category: "Communication",
      aiProviders: ["GPT-4", "Claude", "Gemini"],
      workflow: {
        triggers: ["appointment_scheduled", "treatment_completed"],
        actions: ["send_reminder", "generate_education_content", "schedule_followup"]
      },
      estimatedSavings: 15000,
      implementationTime: "1-2 weeks",
      complexity: "medium",
      tags: ["hipaa-compliant", "patient-care", "scheduling"],
      previewData: {
        tasksAutomated: ["Appointment reminders", "Patient education", "Follow-up scheduling"],
        timeSaved: "20 hours/week"
      }
    },
    {
      id: 2,
      name: "Medical Records Analysis",
      industry: "healthcare",
      description: "AI-powered analysis of patient records for insights and treatment recommendations",
      category: "Analysis",
      aiProviders: ["Claude", "Gemini", "GPT-4"],
      workflow: {
        triggers: ["record_updated", "new_diagnosis"],
        actions: ["analyze_patterns", "suggest_treatments", "flag_risks"]
      },
      estimatedSavings: 25000,
      implementationTime: "2-3 weeks",
      complexity: "high",
      tags: ["analytics", "diagnosis", "risk-assessment"],
      previewData: {
        tasksAutomated: ["Pattern recognition", "Treatment suggestions", "Risk flagging"],
        timeSaved: "30 hours/week"
      }
    },

    // Finance Templates
    {
      id: 3,
      name: "Fraud Detection System",
      industry: "finance",
      description: "Real-time fraud detection using multiple AI models for enhanced accuracy",
      category: "Security",
      aiProviders: ["Gemini", "Claude", "GPT-4", "Grok"],
      workflow: {
        triggers: ["transaction_initiated", "account_access"],
        actions: ["analyze_patterns", "score_risk", "alert_if_suspicious"]
      },
      estimatedSavings: 50000,
      implementationTime: "2-4 weeks",
      complexity: "high",
      tags: ["fraud-prevention", "real-time", "risk-management"],
      previewData: {
        tasksAutomated: ["Transaction monitoring", "Risk scoring", "Alert generation"],
        timeSaved: "40 hours/week"
      }
    },
    {
      id: 4,
      name: "Automated Credit Assessment",
      industry: "finance",
      description: "AI-powered credit scoring and loan approval process automation",
      category: "Underwriting",
      aiProviders: ["Claude", "Gemini", "GPT-4"],
      workflow: {
        triggers: ["loan_application", "credit_check_request"],
        actions: ["analyze_creditworthiness", "generate_report", "make_recommendation"]
      },
      estimatedSavings: 35000,
      implementationTime: "1-3 weeks",
      complexity: "medium",
      tags: ["credit-scoring", "automation", "compliance"],
      previewData: {
        tasksAutomated: ["Credit analysis", "Risk assessment", "Report generation"],
        timeSaved: "25 hours/week"
      }
    },

    // Retail Templates
    {
      id: 5,
      name: "Inventory Optimization",
      industry: "retail",
      description: "AI-driven inventory management and demand forecasting",
      category: "Operations",
      aiProviders: ["Gemini", "Claude", "Grok"],
      workflow: {
        triggers: ["sales_data_update", "seasonal_change"],
        actions: ["forecast_demand", "optimize_stock", "suggest_reorders"]
      },
      estimatedSavings: 20000,
      implementationTime: "1-2 weeks",
      complexity: "medium",
      tags: ["inventory", "forecasting", "optimization"],
      previewData: {
        tasksAutomated: ["Demand forecasting", "Stock optimization", "Reorder suggestions"],
        timeSaved: "15 hours/week"
      }
    },
    {
      id: 6,
      name: "Customer Service Chatbot",
      industry: "retail",
      description: "Multi-AI powered customer service with escalation handling",
      category: "Customer Service",
      aiProviders: ["GPT-4", "Claude", "Gemini"],
      workflow: {
        triggers: ["customer_inquiry", "order_issue"],
        actions: ["understand_intent", "provide_solution", "escalate_if_needed"]
      },
      estimatedSavings: 18000,
      implementationTime: "1-2 weeks",
      complexity: "low",
      tags: ["customer-service", "chatbot", "24/7"],
      previewData: {
        tasksAutomated: ["Customer inquiries", "Order tracking", "Issue resolution"],
        timeSaved: "35 hours/week"
      }
    },

    // Universal Templates
    {
      id: 7,
      name: "Email Marketing Automation",
      industry: "universal",
      description: "AI-powered email campaign creation, personalization, and optimization",
      category: "Marketing",
      aiProviders: ["GPT-4", "Claude", "Grok"],
      workflow: {
        triggers: ["customer_action", "scheduled_campaign"],
        actions: ["personalize_content", "optimize_timing", "analyze_performance"]
      },
      estimatedSavings: 12000,
      implementationTime: "1 week",
      complexity: "low",
      tags: ["email-marketing", "personalization", "automation"],
      previewData: {
        tasksAutomated: ["Email creation", "Personalization", "Send optimization"],
        timeSaved: "20 hours/week"
      }
    },
    {
      id: 8,
      name: "Social Media Management",
      industry: "universal",
      description: "Automated content creation and posting across social platforms",
      category: "Marketing",
      aiProviders: ["GPT-4", "Claude", "Grok"],
      workflow: {
        triggers: ["content_schedule", "trending_topic"],
        actions: ["create_content", "schedule_posts", "monitor_engagement"]
      },
      estimatedSavings: 10000,
      implementationTime: "1 week",
      complexity: "low",
      tags: ["social-media", "content-creation", "scheduling"],
      previewData: {
        tasksAutomated: ["Content creation", "Post scheduling", "Engagement tracking"],
        timeSaved: "18 hours/week"
      }
    }
  ];
}

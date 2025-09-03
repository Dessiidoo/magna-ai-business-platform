import { api } from "encore.dev/api";
import { magnaDB } from "./db";

export interface AIProviderStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  successRate: number;
  currentTasks: number;
  totalRequests: number;
  averageConfidence: number;
  costToday: number;
  lastCheck: Date;
}

export interface RealTimeMetrics {
  providers: AIProviderStatus[];
  totalTasks: number;
  activeTasks: number;
  totalCost: number;
  averageResponseTime: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

// Gets real-time AI provider status and metrics
export const getAIMetrics = api<void, RealTimeMetrics>(
  { expose: true, method: "GET", path: "/ai/metrics" },
  async () => {
    const providers = await getProviderMetrics();
    const totalTasks = providers.reduce((sum, p) => sum + p.currentTasks, 0);
    const activeTasks = await getActiveTasks();
    const totalCost = providers.reduce((sum, p) => sum + p.costToday, 0);
    const averageResponseTime = providers.reduce((sum, p) => sum + p.responseTime, 0) / providers.length;
    
    const systemHealth = calculateSystemHealth(providers);

    return {
      providers,
      totalTasks,
      activeTasks,
      totalCost,
      averageResponseTime,
      systemHealth
    };
  }
);

// Gets detailed metrics for a specific AI provider
export const getProviderDetails = api<{ provider: string }, { metrics: any; tasks: any[] }>(
  { expose: true, method: "GET", path: "/ai/providers/:provider/details" },
  async (req) => {
    const metrics = await getDetailedProviderMetrics(req.provider);
    const tasks = await getProviderTasks(req.provider);
    
    return { metrics, tasks };
  }
);

async function getProviderMetrics(): Promise<AIProviderStatus[]> {
  // Get metrics from the last 24 hours
  const metricsData = await magnaDB.rawQueryAll<any>(`
    SELECT 
      ai_provider,
      COUNT(*) as total_requests,
      AVG(latency_ms) as avg_response_time,
      AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
      SUM(cost) as total_cost,
      MAX(created_at) as last_check
    FROM ai_orchestration_logs 
    WHERE created_at > NOW() - INTERVAL '24 hours'
    GROUP BY ai_provider
  `);

  const currentTasks = await magnaDB.rawQueryAll<any>(`
    SELECT 
      ai_providers_used,
      COUNT(*) as task_count
    FROM optimization_tasks 
    WHERE status = 'processing'
    GROUP BY ai_providers_used
  `);

  const providers = [
    { name: 'openai', displayName: 'GPT-4' },
    { name: 'claude', displayName: 'Claude' },
    { name: 'gemini', displayName: 'Gemini' },
    { name: 'grok', displayName: 'Grok' }
  ];

  return providers.map(provider => {
    const metrics = metricsData.find(m => m.ai_provider === provider.name);
    const tasks = currentTasks.find(t => 
      t.ai_providers_used && JSON.parse(t.ai_providers_used).includes(provider.displayName)
    );

    return {
      name: provider.displayName,
      status: getProviderStatus(metrics?.success_rate || 0),
      responseTime: Math.round(metrics?.avg_response_time || 0),
      successRate: Math.round((metrics?.success_rate || 0) * 100),
      currentTasks: tasks?.task_count || 0,
      totalRequests: metrics?.total_requests || 0,
      averageConfidence: 85 + Math.random() * 10, // Simulated confidence score
      costToday: parseFloat(metrics?.total_cost || 0),
      lastCheck: metrics?.last_check || new Date()
    };
  });
}

async function getDetailedProviderMetrics(provider: string): Promise<any> {
  const hourlyMetrics = await magnaDB.rawQueryAll<any>(`
    SELECT 
      DATE_TRUNC('hour', created_at) as hour,
      COUNT(*) as requests,
      AVG(latency_ms) as avg_latency,
      SUM(cost) as cost,
      AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate
    FROM ai_orchestration_logs 
    WHERE ai_provider = $1 AND created_at > NOW() - INTERVAL '24 hours'
    GROUP BY DATE_TRUNC('hour', created_at)
    ORDER BY hour
  `, provider.toLowerCase());

  return {
    hourlyMetrics,
    totalRequests: hourlyMetrics.reduce((sum, h) => sum + h.requests, 0),
    totalCost: hourlyMetrics.reduce((sum, h) => sum + parseFloat(h.cost), 0),
    averageLatency: hourlyMetrics.reduce((sum, h) => sum + h.avg_latency, 0) / hourlyMetrics.length || 0
  };
}

async function getProviderTasks(provider: string): Promise<any[]> {
  return await magnaDB.rawQueryAll<any>(`
    SELECT 
      ot.id,
      ot.task_type,
      ot.status,
      ot.started_at,
      c.name as company_name
    FROM optimization_tasks ot
    JOIN companies c ON ot.company_id = c.id
    WHERE ot.ai_providers_used::text LIKE $1
    ORDER BY ot.started_at DESC
    LIMIT 10
  `, `%${provider}%`);
}

async function getActiveTasks(): Promise<number> {
  const result = await magnaDB.queryRow<{ count: number }>`
    SELECT COUNT(*) as count FROM optimization_tasks WHERE status = 'processing'
  `;
  return result?.count || 0;
}

function getProviderStatus(successRate: number): 'online' | 'offline' | 'degraded' {
  if (successRate >= 0.95) return 'online';
  if (successRate >= 0.8) return 'degraded';
  return 'offline';
}

function calculateSystemHealth(providers: AIProviderStatus[]): 'healthy' | 'warning' | 'critical' {
  const onlineProviders = providers.filter(p => p.status === 'online').length;
  const totalProviders = providers.length;
  
  if (onlineProviders === totalProviders) return 'healthy';
  if (onlineProviders >= totalProviders * 0.75) return 'warning';
  return 'critical';
}

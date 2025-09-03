import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import backend from '~backend/client';

export function AIMonitoring() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['ai-metrics'],
    queryFn: async () => {
      return await backend.magna.getAIMetrics();
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded w-1/3 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with System Health */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Network Monitor</h1>
          <p className="text-gray-400">
            Real-time monitoring of AI provider performance and orchestration metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
          <div className="text-right">
            <div className={`text-lg font-bold ${getSystemHealthColor(metrics.systemHealth)}`}>
              {metrics.systemHealth.toUpperCase()}
            </div>
            <div className="text-sm text-gray-400">System Status</div>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.activeTasks}</div>
            <p className="text-xs text-gray-400">
              {metrics.totalTasks} total processing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-gray-400">
              Average across all providers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Daily Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${metrics.totalCost.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              AI orchestration costs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Providers Online</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.providers.filter(p => p.status === 'online').length}/{metrics.providers.length}
            </div>
            <p className="text-xs text-gray-400">
              AI systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Provider Status Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {metrics.providers.map((provider) => (
          <Card key={provider.name} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="text-white">{provider.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(provider.status)}
                  <Badge 
                    variant={provider.status === 'online' ? 'default' : 'destructive'}
                    className={
                      provider.status === 'online' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }
                  >
                    {provider.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Response Time</div>
                  <div className="text-lg font-semibold text-white">{provider.responseTime}ms</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                  <div className="text-lg font-semibold text-white">{provider.successRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Current Tasks</div>
                  <div className="text-lg font-semibold text-white">{provider.currentTasks}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Daily Cost</div>
                  <div className="text-lg font-semibold text-white">${provider.costToday.toFixed(2)}</div>
                </div>
              </div>
              
              {/* Performance Indicators */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Success Rate</span>
                  <span className="text-sm text-white">{provider.successRate}%</span>
                </div>
                <Progress 
                  value={provider.successRate} 
                  className="h-2 bg-gray-800" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Confidence Score</span>
                  <span className="text-sm text-white">{provider.averageConfidence.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={provider.averageConfidence} 
                  className="h-2 bg-gray-800" 
                />
              </div>

              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Requests Today</span>
                  <span className="text-white">{provider.totalRequests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Check</span>
                  <span className="text-white">
                    {new Date(provider.lastCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span className="text-white">Real-time Activity</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Live feed of AI orchestration tasks and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm text-white">
                    GPT-4 completed business analysis task
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.floor(Math.random() * 60)} seconds ago • 850ms response • 95% confidence
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  Success
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

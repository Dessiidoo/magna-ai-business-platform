import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cog, 
  Plus, 
  Brain, 
  Zap,
  GitBranch,
  Play,
  Pause,
  Settings,
  Eye
} from 'lucide-react';

export function WorkflowBuilder() {
  const workflows = [
    {
      id: 1,
      name: "Customer Onboarding Flow",
      description: "Automated customer onboarding with AI verification and personalization",
      status: "active",
      nodes: 8,
      aiProviders: ["GPT-4", "Claude"],
      lastRun: "2 hours ago",
      successRate: 94
    },
    {
      id: 2,
      name: "Lead Qualification Pipeline",
      description: "Multi-AI lead scoring and qualification workflow",
      status: "draft",
      nodes: 12,
      aiProviders: ["GPT-4", "Claude", "Gemini"],
      lastRun: "Never",
      successRate: 0
    },
    {
      id: 3,
      name: "Content Creation Pipeline",
      description: "Orchestrated content creation using multiple AI providers",
      status: "paused",
      nodes: 6,
      aiProviders: ["GPT-4", "Grok"],
      lastRun: "1 day ago",
      successRate: 87
    }
  ];

  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', icon: Zap, color: 'text-yellow-400' },
    { type: 'ai_task', label: 'AI Task', icon: Brain, color: 'text-purple-400' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-cyan-400' },
    { type: 'action', label: 'Action', icon: Cog, color: 'text-green-400' },
    { type: 'approval', label: 'Approval', icon: Eye, color: 'text-orange-400' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'paused': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'draft': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Workflow Builder</h1>
          <p className="text-gray-400">
            Create custom automation workflows with drag-and-drop AI orchestration
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Workflow Canvas (Placeholder) */}
      <Card className="bg-gray-900 border-gray-800 min-h-[400px]">
        <CardHeader>
          <CardTitle className="text-white">Visual Workflow Designer</CardTitle>
          <CardDescription className="text-gray-400">
            Drag and drop components to build your AI automation workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
            <div className="space-y-4">
              <Cog className="h-16 w-16 text-gray-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-300">Workflow Canvas</h3>
                <p className="text-gray-500">Interactive workflow builder coming soon</p>
              </div>
              <div className="flex justify-center space-x-4">
                {nodeTypes.map(node => {
                  const Icon = node.icon;
                  return (
                    <div key={node.type} className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Icon className={`h-6 w-6 ${node.color}`} />
                      </div>
                      <span className="text-xs text-gray-400">{node.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Workflows */}
      <div className="grid gap-6">
        <h2 className="text-xl font-semibold text-white">Your Workflows</h2>
        
        {workflows.map(workflow => (
          <Card key={workflow.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                    <Cog className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{workflow.name}</h3>
                    <p className="text-sm text-gray-400">{workflow.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{workflow.nodes} nodes</span>
                      <span className="text-xs text-gray-500">Last run: {workflow.lastRun}</span>
                      {workflow.successRate > 0 && (
                        <span className="text-xs text-green-400">{workflow.successRate}% success</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* AI Providers */}
                  <div className="flex space-x-1">
                    {workflow.aiProviders.map(provider => (
                      <Badge key={provider} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        {provider}
                      </Badge>
                    ))}
                  </div>

                  {/* Status */}
                  <Badge variant="outline" className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                      <Settings className="h-4 w-4" />
                    </Button>
                    {workflow.status === 'active' ? (
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Components Library */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Component Library</CardTitle>
          <CardDescription className="text-gray-400">
            Available workflow components for building automation flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {nodeTypes.map(node => {
              const Icon = node.icon;
              return (
                <div key={node.type} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
                      <Icon className={`h-6 w-6 ${node.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-white text-sm">{node.label}</div>
                      <div className="text-xs text-gray-400">
                        {node.type === 'ai_task' && 'Multi-AI processing'}
                        {node.type === 'trigger' && 'Event-based start'}
                        {node.type === 'condition' && 'Branching logic'}
                        {node.type === 'action' && 'Execute operations'}
                        {node.type === 'approval' && 'Human review'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Workflow Builder Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="font-semibold text-white">Multi-AI Orchestration</h3>
              <p className="text-sm text-gray-400">
                Seamlessly coordinate multiple AI providers in a single workflow
              </p>
            </div>
            <div className="space-y-2">
              <GitBranch className="h-8 w-8 text-cyan-400" />
              <h3 className="font-semibold text-white">Conditional Logic</h3>
              <p className="text-sm text-gray-400">
                Create complex branching workflows with smart decision points
              </p>
            </div>
            <div className="space-y-2">
              <Eye className="h-8 w-8 text-orange-400" />
              <h3 className="font-semibold text-white">Approval Gates</h3>
              <p className="text-sm text-gray-400">
                Add human oversight with approval requirements at critical steps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

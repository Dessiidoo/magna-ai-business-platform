import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Zap, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Star,
  Download,
  Brain
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export function AutomationTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ['automation-templates'],
    queryFn: async () => {
      return await backend.magna.getAutomationTemplates();
    },
  });

  const deployMutation = useMutation({
    mutationFn: async (templateId: number) => {
      // For demo, using company ID 1
      return await backend.magna.deployTemplate({ companyId: 1, templateId });
    },
    onSuccess: () => {
      toast({
        title: "Template Deployed",
        description: "Automation template has been successfully deployed to your company.",
      });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      console.error('Deploy error:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy automation template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const templates = templatesData?.templates || [];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'healthcare': return '🏥';
      case 'finance': return '💰';
      case 'retail': return '🛒';
      case 'universal': return '🌐';
      default: return '🏢';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded w-1/3 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const industries = [...new Set(templates.map(t => t.industry))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Automation Templates</h1>
          <p className="text-gray-400">
            Pre-built AI automation solutions for instant deployment and value
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-400" />
          <span className="text-white font-semibold">{templates.length} Templates Available</span>
        </div>
      </div>

      {/* Industry Filters */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-400">Industries:</span>
        {industries.map(industry => (
          <Badge key={industry} variant="outline" className="border-gray-600 text-gray-300">
            {getIndustryIcon(industry)} {industry}
          </Badge>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getIndustryIcon(template.industry)}</span>
                  <div>
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {template.industry} • {template.category}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getComplexityColor(template.complexity)}
                >
                  {template.complexity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{template.description}</p>

              {/* AI Providers */}
              <div className="flex flex-wrap gap-1">
                {template.aiProviders.map(provider => (
                  <Badge key={provider} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    {provider}
                  </Badge>
                ))}
              </div>

              {/* Preview Data */}
              {template.previewData && (
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-gray-400 font-medium">What it automates:</div>
                  <div className="space-y-1">
                    {template.previewData.tasksAutomated?.map((task: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                  {template.previewData.timeSaved && (
                    <div className="text-xs text-cyan-400 font-medium">
                      ⚡ Saves {template.previewData.timeSaved}
                    </div>
                  )}
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    ${template.estimatedSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Monthly Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-cyan-400">
                    {template.implementationTime}
                  </div>
                  <div className="text-xs text-gray-400">Setup Time</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Deploy Button */}
              <Button 
                onClick={() => deployMutation.mutate(template.id)}
                disabled={deployMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                <Download className="mr-2 h-4 w-4" />
                {deployMutation.isPending ? 'Deploying...' : 'Deploy Template'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Why Use MAGNA Templates?</CardTitle>
          <CardDescription className="text-gray-300">
            Industry-tested automation solutions powered by multiple AI providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="font-semibold text-white">Instant Value</h3>
              <p className="text-sm text-gray-400">
                Pre-configured workflows deliver immediate ROI without custom development
              </p>
            </div>
            <div className="space-y-2">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="font-semibold text-white">Multi-AI Power</h3>
              <p className="text-sm text-gray-400">
                Leverages the best of GPT-4, Claude, Gemini, and Grok for optimal results
              </p>
            </div>
            <div className="space-y-2">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <h3 className="font-semibold text-white">Proven Results</h3>
              <p className="text-sm text-gray-400">
                Industry-tested templates with verified performance metrics and savings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Brain, 
  TrendingUp, 
  DollarSign,
  Users,
  Shield,
  AlertTriangle,
  Target,
  Zap,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export function CompetitorIntelligence() {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState('1');

  const monitorMutation = useMutation({
    mutationFn: async () => {
      return await backend.magna.monitorCompetitors({ 
        companyId: parseInt(companyId) 
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Intelligence Gathered",
        description: `Analyzed ${data.intelligence.length} competitors with actionable insights.`,
      });
    },
    onError: (error) => {
      console.error('Monitoring error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to gather competitor intelligence. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const analysisAreas = [
    { 
      icon: DollarSign, 
      title: 'Pricing Strategy', 
      description: 'Pricing models, recent changes, competitive positioning',
      ai: 'Claude + Gemini'
    },
    { 
      icon: Users, 
      title: 'Marketing Tactics', 
      description: 'Campaigns, messaging, channel strategy, target audience',
      ai: 'Grok + GPT-4'
    },
    { 
      icon: Target, 
      title: 'Product Analysis', 
      description: 'Feature comparison, roadmap indicators, gaps identification',
      ai: 'Claude + Gemini'
    },
    { 
      icon: TrendingUp, 
      title: 'Business Strategy', 
      description: 'Growth plans, partnerships, market positioning',
      ai: 'Multi-AI Analysis'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Competitor Intelligence</h1>
          <p className="text-gray-400">
            AI-powered competitive analysis and market intelligence monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6 text-cyan-400" />
          <span className="text-white font-semibold">Always Watching</span>
        </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analysis Control */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Start Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor competitors using multi-AI intelligence gathering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company ID
                </label>
                <Input
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="Enter company ID"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <Button 
                onClick={() => monitorMutation.mutate()}
                disabled={monitorMutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
              >
                <Search className="mr-2 h-4 w-4" />
                {monitorMutation.isPending ? 'Analyzing...' : 'Start Intelligence Gathering'}
              </Button>
              
              {monitorMutation.isPending && (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">
                    AI systems analyzing competitor landscape...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Areas */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Analysis Areas</CardTitle>
              <CardDescription className="text-gray-400">
                Multi-AI analysis across key competitive dimensions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div key={area.title} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span className="font-medium text-white text-sm">{area.title}</span>
                    </div>
                    <p className="text-xs text-gray-400">{area.description}</p>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                      {area.ai}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Results */}
        <div className="lg:col-span-2 space-y-6">
          {monitorMutation.data ? (
            <>
              {/* Competitor Cards */}
              {monitorMutation.data.intelligence.map((intel, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{intel.competitor}</CardTitle>
                      <Badge variant="outline" className={getThreatColor(intel.threatLevel)}>
                        {intel.threatLevel} threat
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {intel.industry} • Updated {new Date(intel.lastUpdated).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-white">Pricing</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {intel.insights.pricing.analysis.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm font-medium text-white">Marketing</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {intel.insights.marketing.analysis.substring(0, 100)}...
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-white">Key Recommendations</span>
                      </div>
                      <div className="space-y-1">
                        {intel.recommendations.slice(0, 3).map((rec, recIndex) => (
                          <div key={recIndex} className="text-xs text-gray-300 flex items-start space-x-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <Eye className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Competitor Intelligence Ready
                </h3>
                <p className="text-gray-500 mb-6">
                  Start monitoring to gather AI-powered competitive insights and strategic recommendations
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analysisAreas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <div key={area.title} className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mx-auto">
                          <Icon className="h-6 w-6 text-cyan-400" />
                        </div>
                        <span className="text-xs text-gray-400">{area.title}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features Section */}
      <Card className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Intelligence Capabilities</CardTitle>
          <CardDescription className="text-gray-300">
            Advanced AI-powered competitive monitoring and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="font-semibold text-white">Multi-AI Analysis</h3>
              <p className="text-sm text-gray-400">
                Different AI providers analyze specific competitive dimensions for comprehensive insights
              </p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h3 className="font-semibold text-white">Continuous Monitoring</h3>
              <p className="text-sm text-gray-400">
                Real-time tracking of competitor activities, pricing changes, and strategic moves
              </p>
            </div>
            <div className="space-y-2">
              <Target className="h-8 w-8 text-green-400" />
              <h3 className="font-semibold text-white">Actionable Intelligence</h3>
              <p className="text-sm text-gray-400">
                AI-generated recommendations for strategic responses and competitive advantages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

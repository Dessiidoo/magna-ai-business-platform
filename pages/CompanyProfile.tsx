import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Target,
  Cog,
  Mail,
  Phone
} from 'lucide-react';
import backend from '~backend/client';
import type { CompanyWithAnalytics } from '~backend/magna/get-company';
import type { BusinessAnalysis } from '~backend/magna/business-analyzer';

export function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await backend.magna.getCompany({ id: parseInt(id!) });
      return response;
    },
    enabled: !!id,
  });

  const analyzeBusinessMutation = useMutation({
    mutationFn: async () => {
      const response = await backend.magna.analyzeBusiness({ 
        companyId: parseInt(id!) 
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      toast({
        title: "Analysis Complete",
        description: "MAGNA has completed the comprehensive business analysis using multiple AI systems.",
      });
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete business analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateLeadsMutation = useMutation({
    mutationFn: async (params: any) => {
      const response = await backend.magna.generateLeads(params);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      toast({
        title: "Leads Generated",
        description: `Generated ${data.leads.length} qualified leads with personalized outreach.`,
      });
    },
    onError: (error) => {
      console.error('Lead generation error:', error);
      toast({
        title: "Lead Generation Failed",
        description: "Failed to generate leads. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !company) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-8 bg-muted rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleAnalyzeBusiness = () => {
    analyzeBusinessMutation.mutate();
  };

  const handleGenerateLeads = () => {
    generateLeadsMutation.mutate({
      companyId: parseInt(id!),
      targetIndustry: company.industry,
      companySize: company.size,
      jobTitles: ['CEO', 'CTO', 'VP of Operations', 'Director of Technology'],
      location: 'United States'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>{company.industry}</span>
              <span>•</span>
              <Badge variant="outline">{company.size}</Badge>
              {company.website && (
                <>
                  <span>•</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline">
                    {company.website}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAnalyzeBusiness}
            disabled={analyzeBusinessMutation.isPending}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Brain className="mr-2 h-4 w-4" />
            {analyzeBusinessMutation.isPending ? 'Analyzing...' : 'AI Analysis'}
          </Button>
          <Button 
            onClick={handleGenerateLeads}
            disabled={generateLeadsMutation.isPending}
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            {generateLeadsMutation.isPending ? 'Generating...' : 'Generate Leads'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(company.monthlyRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current monthly revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Identified</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${company.analytics.totalSavingsIdentified.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly cost reduction potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated prospects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {company.analytics.completedTasks}/{company.analytics.totalOptimizationTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed optimizations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Company Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="leads">Lead Generation</TabsTrigger>
          <TabsTrigger value="automation">Process Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Company Size</label>
                  <p className="text-sm text-muted-foreground">{company.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Costs</label>
                  <p className="text-sm text-muted-foreground">
                    ${(company.currentCosts || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pain Points</CardTitle>
                <CardDescription>Current business challenges identified</CardDescription>
              </CardHeader>
              <CardContent>
                {company.painPoints && company.painPoints.length > 0 ? (
                  <div className="space-y-2">
                    {company.painPoints.map((point, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No pain points identified yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI-Powered Business Analysis</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis using GPT-4, Claude, Gemini, and Grok in orchestration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyzeBusinessMutation.isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    MAGNA is analyzing your business using multiple AI systems...
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Start AI Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Get comprehensive insights on cost optimization, process automation, and revenue opportunities
                  </p>
                  <Button onClick={handleAnalyzeBusiness} className="bg-gradient-to-r from-primary to-purple-600">
                    <Brain className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>AI Lead Generation</span>
              </CardTitle>
              <CardDescription>
                Multi-source prospecting with AI-powered personalization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generateLeadsMutation.isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    Generating qualified leads with personalized outreach...
                  </p>
                </div>
              ) : company.analytics.totalLeads > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{company.analytics.totalLeads}</div>
                    <p className="text-sm text-muted-foreground">Qualified leads generated</p>
                  </div>
                  <Button onClick={handleGenerateLeads} variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Generate More Leads
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Generate Your First Leads</h3>
                  <p className="text-muted-foreground mb-4">
                    Find and qualify prospects with AI-powered targeting and personalized outreach
                  </p>
                  <Button onClick={handleGenerateLeads} className="bg-gradient-to-r from-primary to-purple-600">
                    <Users className="mr-2 h-4 w-4" />
                    Generate Leads
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cog className="h-5 w-5 text-primary" />
                <span>Process Automation</span>
              </CardTitle>
              <CardDescription>
                AI-identified automation opportunities for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Cog className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Automation Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Run business analysis to identify processes that can be automated
                </p>
                <Button onClick={handleAnalyzeBusiness} variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Processes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

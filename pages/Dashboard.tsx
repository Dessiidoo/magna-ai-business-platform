import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap,
  Brain,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { CreateCompanyDialog } from '../components/CreateCompanyDialog';
import { AIStatusIndicator } from '../components/AIStatusIndicator';
import backend from '~backend/client';
import type { CompanySummary } from '~backend/magna/list-companies';

export function Dashboard() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await backend.magna.listCompanies();
      return response;
    },
  });

  const companies = companiesData?.companies || [];
  const totalCompanies = companiesData?.total || 0;

  // Calculate aggregate metrics
  const totalSavings = companies.reduce((sum, c) => sum + c.totalSavings, 0);
  const totalLeads = companies.reduce((sum, c) => sum + c.leadCount, 0);
  const totalRevenue = companies.reduce((sum, c) => sum + (c.monthlyRevenue || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MAGNA Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered business optimization platform combining the world's top AI systems
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <AIStatusIndicator />
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* AI Power Section */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Multi-AI Intelligence Engine</span>
          </CardTitle>
          <CardDescription>
            Powered by GPT-4, Claude 3.5, Gemini Pro, Grok, and Copilot working in orchestration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">OpenAI GPT-4</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Google Gemini Pro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">X.AI Grok</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Businesses under MAGNA optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings Identified</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Monthly savings through AI optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated and scored prospects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Monthly revenue under management
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            Businesses optimized by MAGNA's AI orchestration engine
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                  <div className="h-12 w-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No companies yet</h3>
              <p className="text-muted-foreground">Add your first company to start AI-powered optimization</p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCompanyDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}

function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{company.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{company.industry}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  {company.size}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-right">
            <div>
              <div className="text-lg font-semibold">${company.totalSavings.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Savings</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{company.leadCount}</div>
              <div className="text-xs text-muted-foreground">Leads</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                ${(company.monthlyRevenue || 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {company.lastActivity 
                  ? `Last activity: ${new Date(company.lastActivity).toLocaleDateString()}`
                  : 'No recent activity'
                }
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/company/${company.id}`}>
                View Details
              </a>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
              <Zap className="mr-1 h-3 w-3" />
              Optimize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

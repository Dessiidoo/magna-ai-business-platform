import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingDown, 
  Brain, 
  Zap,
  CheckCircle,
  ArrowRight,
  Calculator,
  PieChart
} from 'lucide-react';

export function CostOptimization() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cost Optimization</h1>
        <p className="text-muted-foreground">
          AI-powered cost analysis and optimization recommendations
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>MAGNA Cost Optimization Engine</span>
          </CardTitle>
          <CardDescription>
            Multi-AI analysis identifies cost reduction opportunities across your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Cost Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI identifies spending patterns
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Generate cost reduction strategies
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Implementation</h3>
              <p className="text-sm text-muted-foreground">
                Execute savings recommendations
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Track savings and ROI
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span>Software Subscriptions</span>
            </CardTitle>
            <CardDescription>Optimize SaaS and tool spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">License Auditing</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Usage Analysis</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alternative Solutions</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>30-40% average savings</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Automatic renewal tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Operational Costs</span>
            </CardTitle>
            <CardDescription>Reduce overhead and operational expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Process Efficiency</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resource Allocation</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Waste Identification</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>25% cost reduction</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Improved productivity</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              <span>Vendor Optimization</span>
            </CardTitle>
            <CardDescription>Negotiate better deals and contracts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Contract Analysis</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Market Pricing</span>
                <Badge variant="secondary">Grok</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Negotiation Strategies</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>15-20% savings</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Better terms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Labor Optimization</span>
            </CardTitle>
            <CardDescription>Optimize workforce and productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Role Analysis</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skill Mapping</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Automation Opportunities</span>
                <Badge variant="secondary">Multi-AI</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Improved efficiency</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Better resource allocation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Infrastructure Costs</span>
            </CardTitle>
            <CardDescription>Cloud and IT infrastructure optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cloud Optimization</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resource Rightsizing</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cost Monitoring</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>40% cloud savings</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Auto-scaling optimization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>ROI Tracking</span>
            </CardTitle>
            <CardDescription>Monitor and measure cost savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Savings Dashboard</span>
                <Badge variant="secondary">Multi-AI</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Performance Metrics</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Trend Analysis</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Predictive insights</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Optimization Process</CardTitle>
          <CardDescription>
            How MAGNA identifies and implements cost savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                1
              </div>
              <h4 className="font-medium">Cost Audit</h4>
              <p className="text-xs text-muted-foreground">AI analyzes all expenses</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                2
              </div>
              <h4 className="font-medium">Identify Savings</h4>
              <p className="text-xs text-muted-foreground">Find optimization opportunities</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                3
              </div>
              <h4 className="font-medium">Execute & Monitor</h4>
              <p className="text-xs text-muted-foreground">Implement and track results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Start Optimizing Your Costs</CardTitle>
          <CardDescription>
            Analyze your business to identify immediate cost savings opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-primary to-purple-600" asChild>
              <a href="/">
                <DollarSign className="mr-2 h-4 w-4" />
                Start Cost Analysis
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/analytics">
                View Savings Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

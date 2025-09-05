import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cog, 
  Zap, 
  Clock, 
  DollarSign, 
  Brain,
  CheckCircle,
  ArrowRight,
  Bot
} from 'lucide-react';

export function ProcessAutomation() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Process Automation</h1>
        <p className="text-muted-foreground">
          AI-powered business process optimization and automation recommendations
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cog className="h-5 w-5 text-primary" />
            <span>MAGNA Automation Engine</span>
          </CardTitle>
          <CardDescription>
            Multi-AI analysis identifies and implements automation opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Process Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI identifies automation opportunities
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Solution Design</h3>
              <p className="text-sm text-muted-foreground">
                Custom automation workflows generated
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Implementation</h3>
              <p className="text-sm text-muted-foreground">
                AI-assisted deployment and testing
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Continuous improvement and monitoring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Customer Support</span>
            </CardTitle>
            <CardDescription>AI-powered customer service automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Chatbot Integration</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ticket Routing</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Generation</span>
                <Badge variant="secondary">Multi-AI</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>80% time savings</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>24/7 availability</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Sales Automation</span>
            </CardTitle>
            <CardDescription>Lead qualification and nurturing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead Scoring</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow-up Sequences</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Proposal Generation</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>300% lead conversion</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Zero manual follow-ups</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Operations</span>
            </CardTitle>
            <CardDescription>Workflow and process optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Processing</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Report Generation</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quality Control</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>90% error reduction</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Real-time monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Content Creation</span>
            </CardTitle>
            <CardDescription>Automated content and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Blog Posts</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Documentation</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>10x content output</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Brand consistency</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Marketing Automation</span>
            </CardTitle>
            <CardDescription>Campaign optimization and targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ad Optimization</span>
                <Badge variant="secondary">Grok</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Campaigns</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">A/B Testing</span>
                <Badge variant="secondary">Multi-AI</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>250% ROI improvement</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Real-time optimization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Quality Assurance</span>
            </CardTitle>
            <CardDescription>Automated testing and validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Code Review</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Test Generation</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bug Detection</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
            </div>
            <div className="pt-2 space-y-1">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>95% bug reduction</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3 w-3 mr-2" />
                <span>Continuous monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation Implementation Process</CardTitle>
          <CardDescription>
            How MAGNA implements AI-powered automation in your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                1
              </div>
              <h4 className="font-medium">Process Audit</h4>
              <p className="text-xs text-muted-foreground">AI analyzes current workflows</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                2
              </div>
              <h4 className="font-medium">Solution Design</h4>
              <p className="text-xs text-muted-foreground">Custom automation blueprint</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto">
                3
              </div>
              <h4 className="font-medium">Implementation</h4>
              <p className="text-xs text-muted-foreground">Deploy and test automation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready to Automate Your Business?</CardTitle>
          <CardDescription>
            Start with a company analysis to identify automation opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-primary to-purple-600" asChild>
              <a href="/">
                <Cog className="mr-2 h-4 w-4" />
                Start Automation Analysis
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/analytics">
                View Analytics
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

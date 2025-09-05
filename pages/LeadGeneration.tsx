import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Mail, 
  Phone, 
  Building2,
  Brain,
  Zap
} from 'lucide-react';

export function LeadGeneration() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Lead Generation</h1>
        <p className="text-muted-foreground">
          Multi-source prospecting with AI-powered personalization and scoring
        </p>
      </div>

      {/* AI Lead Generation Process */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>MAGNA Lead Generation Engine</span>
          </CardTitle>
          <CardDescription>
            Powered by multiple AI systems for maximum lead quality and conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">AI Targeting</h3>
              <p className="text-sm text-muted-foreground">
                Multi-AI analysis identifies ideal prospects
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Multi-Source Search</h3>
              <p className="text-sm text-muted-foreground">
                Hunter, Apollo, LinkedIn, and custom databases
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">AI Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Claude + GPT-4 lead qualification and scoring
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Personalized Outreach</h3>
              <p className="text-sm text-muted-foreground">
                AI-generated emails and follow-up sequences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Smart Targeting</span>
            </CardTitle>
            <CardDescription>AI-powered prospect identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Industry Analysis</span>
                <Badge variant="secondary">Claude + Gemini</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Buying Intent Signals</span>
                <Badge variant="secondary">Grok + GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Company Sizing</span>
                <Badge variant="secondary">Multi-AI</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Data Sources</span>
            </CardTitle>
            <CardDescription>Comprehensive prospect databases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Hunter.io (Email)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Apollo.io (B2B Data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Clearbit (Enrichment)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">ZoomInfo (Enterprise)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Personalization</span>
            </CardTitle>
            <CardDescription>AI-crafted outreach messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Generation</span>
                <Badge variant="secondary">GPT-4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow-up Sequences</span>
                <Badge variant="secondary">Claude</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">LinkedIn Messages</span>
                <Badge variant="secondary">Gemini</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Lead Scoring</span>
            </CardTitle>
            <CardDescription>AI-powered qualification system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">87%</div>
              <div className="text-sm text-muted-foreground">Average lead score accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">Job Title Relevance</div>
              <div className="text-sm">Company Fit Score</div>
              <div className="text-sm">Buying Authority</div>
              <div className="text-sm">Engagement Potential</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Automation</span>
            </CardTitle>
            <CardDescription>End-to-end lead generation pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Automated Prospecting</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Real-time Scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Smart Follow-ups</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">CRM Integration</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Enterprise Ready</span>
            </CardTitle>
            <CardDescription>Scalable for any business size</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Leads per hour capacity</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">Multi-team collaboration</div>
              <div className="text-sm">Custom data sources</div>
              <div className="text-sm">Advanced analytics</div>
              <div className="text-sm">White-label options</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Generate Qualified Leads?</CardTitle>
          <CardDescription>
            Start with a company profile to unlock MAGNA's lead generation capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-primary to-purple-600" asChild>
              <a href="/">
                <Users className="mr-2 h-4 w-4" />
                Start Lead Generation
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

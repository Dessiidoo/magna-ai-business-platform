import React from 'react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Brain, 
  Zap, 
  TrendingUp,
  Mail,
  MessageSquare,
  BarChart3,
  Globe,
  Copy,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export function ContentStudio() {
  const { toast } = useToast();
  const [contentRequest, setContentRequest] = useState({
    type: 'blog' as 'blog' | 'social' | 'email' | 'research' | 'analysis',
    topic: '',
    targetAudience: '',
    brandVoice: '',
    length: 'medium' as 'short' | 'medium' | 'long',
    keywords: ''
  });

  const createContentMutation = useMutation({
    mutationFn: async () => {
      return await backend.magna.createContent({
        ...contentRequest,
        keywords: contentRequest.keywords ? contentRequest.keywords.split(',').map(k => k.trim()) : undefined
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Content Created",
        description: `Your ${contentRequest.type} content has been generated successfully.`,
      });
    },
    onError: (error) => {
      console.error('Content creation error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const contentTypes = [
    { value: 'blog', label: 'Blog Post', icon: FileText, provider: 'GPT-4', description: 'SEO-optimized blog articles' },
    { value: 'research', label: 'Research Report', icon: BarChart3, provider: 'Claude', description: 'In-depth analysis and insights' },
    { value: 'analysis', label: 'Data Analysis', icon: TrendingUp, provider: 'Gemini', description: 'Statistical insights and trends' },
    { value: 'social', label: 'Social Media', icon: MessageSquare, provider: 'Grok', description: 'Trend-aware social content' },
    { value: 'email', label: 'Email Campaign', icon: Mail, provider: 'GPT-4', description: 'Conversion-focused emails' }
  ];

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'GPT-4': return 'text-green-400';
      case 'Claude': return 'text-blue-400';
      case 'Gemini': return 'text-purple-400';
      case 'Grok': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentRequest.topic || !contentRequest.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in the topic and target audience fields.",
        variant: "destructive",
      });
      return;
    }
    createContentMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Content Studio</h1>
          <p className="text-gray-400">
            AI-orchestrated content creation using multiple specialized providers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-400" />
          <span className="text-white font-semibold">Multi-AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Create Content</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your content requirements and let AI orchestration do the work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentTypes.map(type => {
                    const Icon = type.icon;
                    const isSelected = contentRequest.type === type.value;
                    return (
                      <div
                        key={type.value}
                        onClick={() => setContentRequest(prev => ({ ...prev, type: type.value as any }))}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                          <div>
                            <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                            <Badge 
                              variant="outline" 
                              className={`mt-1 text-xs ${getProviderColor(type.provider)} border-current`}
                            >
                              {type.provider}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g., AI automation trends in healthcare"
                    value={contentRequest.topic}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, topic: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Healthcare executives, Tech decision makers"
                    value={contentRequest.targetAudience}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Brand Voice & Length */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand Voice</label>
                    <Select 
                      value={contentRequest.brandVoice} 
                      onValueChange={(value) => setContentRequest(prev => ({ ...prev, brandVoice: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select brand voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="professional">Professional & Authoritative</SelectItem>
                        <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                        <SelectItem value="technical">Technical & Detailed</SelectItem>
                        <SelectItem value="creative">Creative & Innovative</SelectItem>
                        <SelectItem value="casual">Casual & Approachable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
                    <Select 
                      value={contentRequest.length} 
                      onValueChange={(value) => setContentRequest(prev => ({ ...prev, length: value as any }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="short">Short (300-500 words)</SelectItem>
                        <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                        <SelectItem value="long">Long (1500+ words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keywords (Optional)</label>
                  <Input
                    placeholder="AI automation, healthcare technology, efficiency (comma-separated)"
                    value={contentRequest.keywords}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, keywords: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple keywords with commas</p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={createContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {createContentMutation.isPending ? 'Creating Content...' : 'Generate Content'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Content Output */}
          {createContentMutation.data && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Generated Content</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-800">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {createContentMutation.data.metadata.provider}
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                      {createContentMutation.data.metadata.wordCount} words
                    </Badge>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      {Math.round(createContentMutation.data.metadata.confidence * 100)}% confidence
                    </Badge>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      {createContentMutation.data.metadata.readabilityScore}/100 readability
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {createContentMutation.data.content}
                    </pre>
                  </div>

                  {/* SEO Optimization (if available) */}
                  {createContentMutation.data.seoOptimization && (
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">SEO Recommendations</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div><strong>Meta Title:</strong> {createContentMutation.data.seoOptimization.metaTitle}</div>
                        <div><strong>Meta Description:</strong> {createContentMutation.data.seoOptimization.metaDescription}</div>
                      </div>
                    </div>
                  )}

                  {/* Social Variants (if available) */}
                  {createContentMutation.data.socialVariants && (
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Social Media Variants</h4>
                      <div className="space-y-3">
                        {createContentMutation.data.socialVariants.map((variant, index) => (
                          <div key={index} className="p-3 bg-gray-800 rounded border-l-4 border-cyan-500">
                            <p className="text-sm text-gray-300">{variant}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Provider Info Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">AI Specializations</CardTitle>
              <CardDescription className="text-gray-400">
                Each AI provider is optimized for specific content types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'GPT-4', specialty: 'Blog Posts & Emails', strength: 'Creative writing, engagement', color: 'text-green-400' },
                { name: 'Claude', specialty: 'Research & Analysis', strength: 'Deep analysis, accuracy', color: 'text-blue-400' },
                { name: 'Gemini', specialty: 'Data & Technical', strength: 'Data insights, technical content', color: 'text-purple-400' },
                { name: 'Grok', specialty: 'Social & Trends', strength: 'Trend awareness, viral content', color: 'text-orange-400' }
              ].map(ai => (
                <div key={ai.name} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className={`h-4 w-4 ${ai.color}`} />
                    <span className={`font-medium ${ai.color}`}>{ai.name}</span>
                  </div>
                  <div className="text-sm text-gray-300">{ai.specialty}</div>
                  <div className="text-xs text-gray-500">{ai.strength}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Content Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'SEO optimization',
                'Multi-platform formatting',
                'Brand voice consistency',
                'Trend-aware content',
                'Performance tracking',
                'A/B test variants'
              ].map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

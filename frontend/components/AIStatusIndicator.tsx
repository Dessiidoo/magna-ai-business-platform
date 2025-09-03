import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';

export function AIStatusIndicator() {
  const aiProviders = [
    { name: 'GPT-4', status: 'online' },
    { name: 'Claude', status: 'online' },
    { name: 'Gemini', status: 'online' },
    { name: 'Grok', status: 'online' },
  ];

  const allOnline = aiProviders.every(p => p.status === 'online');

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Brain className="h-4 w-4 text-primary" />
        <Zap className="h-3 w-3 text-primary" />
      </div>
      <Badge 
        variant={allOnline ? 'default' : 'destructive'}
        className="bg-green-500 hover:bg-green-600"
      >
        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
        AI Systems Online
      </Badge>
    </div>
  );
}

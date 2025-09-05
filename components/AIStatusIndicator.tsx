import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';

export function AIStatusIndicator() {
  const aiProviders = [
    { name: 'GPT-4', status: 'online', position: { x: 80, y: 20 } },
    { name: 'Claude', status: 'online', position: { x: 20, y: 60 } },
    { name: 'Gemini', status: 'online', position: { x: 140, y: 60 } },
    { name: 'Grok', status: 'online', position: { x: 80, y: 100 } },
  ];

  const allOnline = aiProviders.every(p => p.status === 'online');

  return (
    <div className="flex items-center space-x-4">
      {/* AI Solar System Visualization */}
      <div className="relative w-40 h-32">
        {/* Central Star */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <Star className="h-8 w-8 text-yellow-400 animate-pulse" fill="currentColor" />
            <div className="absolute inset-0 animate-ping">
              <Star className="h-8 w-8 text-yellow-400 opacity-30" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* AI Providers orbiting */}
        {aiProviders.map((provider, index) => (
          <div
            key={provider.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${provider.position.x}px`,
              top: `${provider.position.y}px`,
              animation: `orbit-${index} 8s linear infinite`
            }}
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${
                provider.status === 'online' ? 'bg-green-400' : 'bg-red-400'
              } animate-pulse`}></div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white/70 whitespace-nowrap">
                {provider.name}
              </div>
              {/* Energy lines to center */}
              <div className="absolute inset-0 opacity-30">
                <div 
                  className="absolute w-px bg-gradient-to-r from-yellow-400 to-transparent"
                  style={{
                    height: '60px',
                    transform: `rotate(${Math.atan2(
                      60 - provider.position.y,
                      80 - provider.position.x
                    )}rad)`,
                    transformOrigin: 'center bottom'
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Badge 
        variant={allOnline ? 'default' : 'destructive'}
        className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        AI NETWORK ONLINE
      </Badge>

      <style jsx>{`
        @keyframes orbit-0 {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes orbit-1 {
          from { transform: rotate(90deg) translateX(40px) rotate(-90deg); }
          to { transform: rotate(450deg) translateX(40px) rotate(-450deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(180deg) translateX(40px) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(40px) rotate(-540deg); }
        }
        @keyframes orbit-3 {
          from { transform: rotate(270deg) translateX(40px) rotate(-270deg); }
          to { transform: rotate(630deg) translateX(40px) rotate(-630deg); }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Cog, 
  DollarSign, 
  Brain,
  TrendingUp,
  Star,
  Zap,
  FileText,
  Eye,
  Layers
} from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/ai-monitoring', label: 'AI Monitor', icon: Brain },
    { path: '/templates', label: 'Templates', icon: Layers },
    { path: '/workflows', label: 'Workflows', icon: Cog },
    { path: '/content', label: 'Content Studio', icon: FileText },
    { path: '/intelligence', label: 'Intel', icon: Eye },
  ];

  return (
    <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with AI Solar System */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Star className="h-8 w-8 text-yellow-400 animate-pulse" fill="currentColor" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Brain className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MAGNA
              </h1>
              <span className="text-xs text-gray-400 tracking-wider">AI ORCHESTRATION PLATFORM</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

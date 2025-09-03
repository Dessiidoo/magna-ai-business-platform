import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CompanyProfile } from './pages/CompanyProfile';
import { AIMonitoring } from './pages/AIMonitoring';
import { AutomationTemplates } from './pages/AutomationTemplates';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { ContentStudio } from './pages/ContentStudio';
import { CompetitorIntelligence } from './pages/CompetitorIntelligence';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppInner() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Router>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/company/:id" element={<CompanyProfile />} />
            <Route path="/ai-monitoring" element={<AIMonitoring />} />
            <Route path="/templates" element={<AutomationTemplates />} />
            <Route path="/workflows" element={<WorkflowBuilder />} />
            <Route path="/content" element={<ContentStudio />} />
            <Route path="/intelligence" element={<CompetitorIntelligence />} />
          </Routes>
        </main>
        <Toaster />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

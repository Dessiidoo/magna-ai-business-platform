import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CompanyProfile } from './pages/CompanyProfile';
import { Analytics } from './pages/Analytics';
import { LeadGeneration } from './pages/LeadGeneration';
import { ProcessAutomation } from './pages/ProcessAutomation';
import { CostOptimization } from './pages/CostOptimization';

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
    <div className="min-h-screen bg-background">
      <Router>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/company/:id" element={<CompanyProfile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leads" element={<LeadGeneration />} />
            <Route path="/automation" element={<ProcessAutomation />} />
            <Route path="/optimization" element={<CostOptimization />} />
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

-- Companies and their AI automation setups
CREATE TABLE companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  size TEXT NOT NULL, -- 'startup', 'small', 'medium', 'large', 'enterprise'
  monthly_revenue BIGINT,
  current_costs BIGINT,
  pain_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Providers and their capabilities
CREATE TABLE ai_providers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  provider_type TEXT NOT NULL, -- 'llm', 'vision', 'speech', 'search', 'analytics'
  api_endpoint TEXT NOT NULL,
  capabilities JSONB NOT NULL,
  cost_per_token DOUBLE PRECISION,
  rate_limits JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business optimization tasks managed by MAGNA
CREATE TABLE optimization_tasks (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  task_type TEXT NOT NULL, -- 'cost_analysis', 'process_automation', 'lead_generation', 'market_research'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  ai_providers_used JSONB,
  input_data JSONB,
  results JSONB,
  cost_savings BIGINT,
  efficiency_gain DOUBLE PRECISION,
  implementation_plan JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Generated leads and prospects
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  position TEXT,
  industry TEXT,
  score DOUBLE PRECISION, -- AI-calculated lead score
  contact_data JSONB,
  generated_email TEXT,
  follow_up_strategy JSONB,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'responded', 'qualified', 'converted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business processes that can be automated
CREATE TABLE processes (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  name TEXT NOT NULL,
  description TEXT,
  current_cost BIGINT,
  current_time_hours DOUBLE PRECISION,
  automation_potential DOUBLE PRECISION, -- 0-1 scale
  ai_solution JSONB,
  estimated_savings BIGINT,
  implementation_complexity TEXT, -- 'low', 'medium', 'high'
  roi_months INTEGER,
  status TEXT DEFAULT 'identified', -- 'identified', 'planned', 'implementing', 'automated'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market research and competitor analysis
CREATE TABLE market_insights (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  research_type TEXT NOT NULL, -- 'competitor', 'market_size', 'trends', 'pricing'
  insights JSONB NOT NULL,
  confidence_score DOUBLE PRECISION,
  sources JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI orchestration logs
CREATE TABLE ai_orchestration_logs (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT REFERENCES optimization_tasks(id),
  ai_provider TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  cost DOUBLE PRECISION,
  latency_ms INTEGER,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

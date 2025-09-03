-- Automation templates
CREATE TABLE automation_templates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  category TEXT,
  ai_providers JSONB,
  workflow JSONB,
  estimated_savings BIGINT,
  implementation_time TEXT,
  complexity TEXT,
  tags JSONB,
  preview_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflows
CREATE TABLE custom_workflows (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow executions
CREATE TABLE workflow_executions (
  id BIGSERIAL PRIMARY KEY,
  workflow_id BIGINT REFERENCES custom_workflows(id),
  status TEXT DEFAULT 'running',
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Workflow approvals
CREATE TABLE workflow_approvals (
  id BIGSERIAL PRIMARY KEY,
  execution_id BIGINT REFERENCES workflow_executions(id),
  node_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  request_data JSONB,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content creation history
CREATE TABLE content_creations (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  content_type TEXT NOT NULL,
  topic TEXT,
  target_audience TEXT,
  brand_voice TEXT,
  ai_providers_used JSONB,
  content_output TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users for secure access
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security audit logs
CREATE TABLE security_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  client_ip TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

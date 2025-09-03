import { api, APIError } from "encore.dev/api";
import { magnaDB } from "./db";

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai_task' | 'condition' | 'action' | 'approval';
  position: { x: number; y: number };
  data: {
    label: string;
    config: any;
    aiProvider?: string;
    conditions?: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'conditional';
  data?: any;
}

export interface CustomWorkflow {
  id: number;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'active' | 'paused';
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new custom workflow
export const createWorkflow = api<{
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  companyId: number;
}, CustomWorkflow>(
  { expose: true, method: "POST", path: "/workflows" },
  async (req) => {
    const result = await magnaDB.queryRow<CustomWorkflow>`
      INSERT INTO custom_workflows (
        name, description, nodes, edges, status, company_id
      ) VALUES (
        ${req.name}, ${req.description}, ${JSON.stringify(req.nodes)}, 
        ${JSON.stringify(req.edges)}, 'draft', ${req.companyId}
      ) RETURNING *
    `;

    if (!result) {
      throw APIError.internal("Failed to create workflow");
    }

    return {
      ...result,
      nodes: result.nodes as WorkflowNode[],
      edges: result.edges as WorkflowEdge[],
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }
);

// Updates an existing workflow
export const updateWorkflow = api<{
  id: number;
  name?: string;
  description?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  status?: 'draft' | 'active' | 'paused';
}, CustomWorkflow>(
  { expose: true, method: "PUT", path: "/workflows/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(req.name);
    }
    if (req.description) {
      updates.push(`description = $${paramIndex++}`);
      values.push(req.description);
    }
    if (req.nodes) {
      updates.push(`nodes = $${paramIndex++}`);
      values.push(JSON.stringify(req.nodes));
    }
    if (req.edges) {
      updates.push(`edges = $${paramIndex++}`);
      values.push(JSON.stringify(req.edges));
    }
    if (req.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(req.status);
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const query = `
      UPDATE custom_workflows 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await magnaDB.rawQueryRow<any>(query, ...values);

    if (!result) {
      throw APIError.notFound("Workflow not found");
    }

    return {
      ...result,
      nodes: result.nodes as WorkflowNode[],
      edges: result.edges as WorkflowEdge[],
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }
);

// Gets workflows for a company
export const getCompanyWorkflows = api<{ companyId: number }, { workflows: CustomWorkflow[] }>(
  { expose: true, method: "GET", path: "/companies/:companyId/workflows" },
  async (req) => {
    const workflows = await magnaDB.queryAll<any>`
      SELECT * FROM custom_workflows 
      WHERE company_id = ${req.companyId}
      ORDER BY updated_at DESC
    `;

    return {
      workflows: workflows.map(w => ({
        ...w,
        nodes: w.nodes as WorkflowNode[],
        edges: w.edges as WorkflowEdge[],
        createdAt: w.created_at,
        updatedAt: w.updated_at
      }))
    };
  }
);

// Executes a workflow
export const executeWorkflow = api<{ workflowId: number; inputData?: any }, { executionId: number }>(
  { expose: true, method: "POST", path: "/workflows/:workflowId/execute" },
  async (req) => {
    const workflow = await magnaDB.queryRow<any>`
      SELECT * FROM custom_workflows WHERE id = ${req.workflowId}
    `;

    if (!workflow) {
      throw APIError.notFound("Workflow not found");
    }

    if (workflow.status !== 'active') {
      throw APIError.failedPrecondition("Workflow is not active");
    }

    // Create execution record
    const execution = await magnaDB.queryRow<{ id: number }>`
      INSERT INTO workflow_executions (
        workflow_id, status, input_data
      ) VALUES (
        ${req.workflowId}, 'running', ${JSON.stringify(req.inputData || {})}
      ) RETURNING id
    `;

    // Start workflow execution (async)
    executeWorkflowAsync(workflow, execution!.id, req.inputData);

    return { executionId: execution!.id };
  }
);

async function executeWorkflowAsync(workflow: any, executionId: number, inputData: any) {
  try {
    const nodes = workflow.nodes as WorkflowNode[];
    const edges = workflow.edges as WorkflowEdge[];
    
    // Find trigger node
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      throw new Error('No trigger node found');
    }

    let currentNode = triggerNode;
    let executionData = inputData || {};

    while (currentNode) {
      // Execute current node
      const result = await executeNode(currentNode, executionData, executionId);
      
      if (result.error) {
        await updateExecutionStatus(executionId, 'failed', result.error);
        return;
      }

      // Merge result data
      executionData = { ...executionData, ...result.data };

      // Find next node
      const nextEdge = edges.find(e => e.source === currentNode!.id);
      if (!nextEdge) break;

      // Check conditions if applicable
      if (nextEdge.type === 'conditional' && !evaluateCondition(nextEdge.data, executionData)) {
        break;
      }

      currentNode = nodes.find(n => n.id === nextEdge.target);
    }

    await updateExecutionStatus(executionId, 'completed');
  } catch (error) {
    await updateExecutionStatus(executionId, 'failed', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function executeNode(node: WorkflowNode, data: any, executionId: number): Promise<{ data?: any; error?: string }> {
  try {
    switch (node.type) {
      case 'ai_task':
        return await executeAITask(node, data);
      case 'condition':
        return await executeCondition(node, data);
      case 'action':
        return await executeAction(node, data);
      case 'approval':
        return await executeApproval(node, data, executionId);
      default:
        return { data };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Node execution failed' };
  }
}

async function executeAITask(node: WorkflowNode, data: any): Promise<{ data?: any; error?: string }> {
  const { config, aiProvider } = node.data;
  
  // This would integrate with the AI orchestrator
  const mockResult = {
    result: `AI task completed using ${aiProvider}`,
    confidence: 0.85,
    provider: aiProvider
  };

  return { data: { ...data, [node.id]: mockResult } };
}

async function executeCondition(node: WorkflowNode, data: any): Promise<{ data?: any; error?: string }> {
  const { conditions } = node.data;
  const result = evaluateCondition(conditions, data);
  
  return { data: { ...data, [node.id]: { conditionMet: result } } };
}

async function executeAction(node: WorkflowNode, data: any): Promise<{ data?: any; error?: string }> {
  const { config } = node.data;
  
  // Mock action execution
  const result = { actionCompleted: true, timestamp: new Date() };
  
  return { data: { ...data, [node.id]: result } };
}

async function executeApproval(node: WorkflowNode, data: any, executionId: number): Promise<{ data?: any; error?: string }> {
  // Create approval request
  await magnaDB.exec`
    INSERT INTO workflow_approvals (
      execution_id, node_id, status, request_data
    ) VALUES (
      ${executionId}, ${node.id}, 'pending', ${JSON.stringify(data)}
    )
  `;

  // For now, auto-approve (in real system, this would wait for manual approval)
  return { data: { ...data, [node.id]: { approved: true, approvedAt: new Date() } } };
}

function evaluateCondition(conditions: any, data: any): boolean {
  if (!conditions) return true;
  
  // Simple condition evaluation
  const { field, operator, value } = conditions;
  const fieldValue = data[field];
  
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'contains':
      return String(fieldValue).includes(value);
    default:
      return true;
  }
}

async function updateExecutionStatus(executionId: number, status: string, error?: string): Promise<void> {
  await magnaDB.exec`
    UPDATE workflow_executions 
    SET status = ${status}, error_message = ${error || null}, completed_at = NOW()
    WHERE id = ${executionId}
  `;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface WorkflowSearchResult {
  id: string;
  name: string;
  description: string;
  trigger: string;
  services: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nodeCount: number;
  score: number;
  fileUrl?: string;
  fileType?: string;
  nodes?: string[];
}

export interface SearchResponse {
  success: boolean;
  query: string;
  results: WorkflowSearchResult[];
  count: number;
}

export interface WorkflowDetails {
  workflowName: string;
  description: string;
  requirements: string;
  detailedInfo: string;
  nodeCount: number;
  nodes: string[];
}

export class WorkflowApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'WorkflowApiError';
  }
}

export const workflowApi = {
  async searchWorkflows(query: string): Promise<WorkflowSearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new WorkflowApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data: SearchResponse = await response.json();
      return data.results;
    } catch (error) {
      if (error instanceof WorkflowApiError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new WorkflowApiError(
          'Unable to connect to the API server. Please make sure the backend is running.'
        );
      }
      
      throw new WorkflowApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  },

  async getWorkflowDetails(workflowName: string, nodes: string[], description?: string): Promise<WorkflowDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowName, nodes, description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new WorkflowApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WorkflowApiError) {
        throw error;
      }
      
      throw new WorkflowApiError(
        error instanceof Error ? error.message : 'Failed to get workflow details'
      );
    }
  },

  async getSetupInstructions(workflowName: string, nodes: string[]): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/setup-instructions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowName, nodes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new WorkflowApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data.instructions;
    } catch (error) {
      if (error instanceof WorkflowApiError) {
        throw error;
      }
      
      throw new WorkflowApiError(
        error instanceof Error ? error.message : 'Failed to generate setup instructions'
      );
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
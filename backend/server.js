import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://madhavchaturvedi005.github.io']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));
app.use(express.json());

// Configuration
const QDRANT_URL = process.env.QDRANT_URL;
const COLLECTION_NAME = "n8n_workflows";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const qdrantHeaders = {
  headers: {
    "api-key": process.env.QDRANT_API_KEY,
    "Content-Type": "application/json",
  },
};

// Generate workflow description using LLM
async function generateWorkflowDescription(workflowTitle, nodes) {
  try {
    const prompt = `Create a concise, user-friendly description (max 100 words) for this n8n workflow:

Title: ${workflowTitle}
Nodes used: ${nodes.join(", ")}

Focus on:
- What the workflow does
- Main use case or benefit
- Who would use it

Write in a helpful, professional tone.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Description generation error:", error);
    return `This workflow uses ${nodes.slice(0, 3).join(", ")} to automate tasks related to ${workflowTitle}.`;
  }
}

// Generate workflow requirements using LLM
async function generateWorkflowRequirements(workflowTitle, nodes) {
  try {
    const prompt = `Analyze this n8n workflow and list the requirements:

Title: ${workflowTitle}
Nodes: ${nodes.join(", ")}

Provide:
1. Required credentials/API keys
2. Prerequisites (accounts, services)
3. Technical requirements
4. Permissions needed

Format as a clear, bulleted list. Be specific and practical.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Requirements generation error:", error);
    return `• API credentials for: ${nodes.filter(node => !['Start', 'Manual Trigger', 'Webhook', 'If', 'Set'].includes(node)).slice(0, 3).join(", ")}\n• Active accounts for required services\n• n8n instance with appropriate permissions\n• Network access to external APIs`;
  }
}

// Generate workflow detailed information using LLM
async function generateWorkflowInfo(workflowTitle, nodes) {
  try {
    const prompt = `Provide detailed information about this n8n workflow:

Title: ${workflowTitle}
Nodes: ${nodes.join(", ")}

Include:
- How it works (workflow logic)
- Key benefits
- Use cases
- Best practices
- Limitations or considerations

Write in a helpful, informative tone. Max 200 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Info generation error:", error);
    return `This workflow automates tasks using ${nodes.length} nodes including ${nodes.slice(0, 3).join(", ")}. It provides efficient automation for ${workflowTitle.toLowerCase()} related processes. The workflow can be customized to fit specific business needs and integrates with various external services.`;
  }
}

// Generate setup instructions using LLM
async function generateSetupInstructions(workflowTitle, nodes) {
  try {
    const prompt = `Create step-by-step setup instructions for this n8n workflow:

Title: ${workflowTitle}
Nodes: ${nodes.join(", ")}

Provide 4-6 clear, actionable steps that include:
- Required credentials/API keys
- Node configuration
- Testing steps
- Common gotchas or tips

Format as a numbered list. Be specific and helpful.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Setup instructions generation error:", error);
    return `1. Import the workflow into your n8n instance\n2. Configure credentials for: ${nodes.filter(node => !['Start', 'Manual Trigger', 'Webhook'].includes(node)).slice(0, 3).join(", ")}\n3. Test the workflow with sample data\n4. Activate the workflow when ready`;
  }
}

// Search workflow function
async function searchWorkflow(userQuery) {
  try {
    // Create embedding for user input
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: userQuery,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    // Search Qdrant - limit to 5 results
    const response = await axios.post(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
      {
        vector: queryVector,
        limit: 5,
        with_payload: true,
      },
      qdrantHeaders
    );

    return response.data.result;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "n8n Workflow AI API is running" });
});

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ 
        error: "Query is required and must be a string" 
      });
    }

    const results = await searchWorkflow(query);
    
    // Transform results and generate descriptions
    const workflows = await Promise.all(
      results.map(async (item, index) => {
        const nodes = item.payload.nodes || [];
        const title = item.payload.title || "Untitled Workflow";
        
        // Generate LLM description
        const description = await generateWorkflowDescription(title, nodes);
        
        return {
          id: item.id || `workflow-${index}`,
          name: title,
          description,
          trigger: nodes[0] || "Manual Trigger",
          services: nodes.slice(0, 4),
          difficulty: item.score > 0.8 ? "beginner" : item.score > 0.6 ? "intermediate" : "advanced",
          nodeCount: nodes.length,
          score: item.score,
          fileUrl: item.payload.file_url,
          fileType: item.payload.file_type,
          nodes: nodes // Include for setup instructions
        };
      })
    );

    res.json({
      success: true,
      query,
      results: workflows,
      count: workflows.length
    });

  } catch (error) {
    console.error("API search error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

app.post("/api/setup-instructions", async (req, res) => {
  try {
    const { workflowName, nodes } = req.body;
    
    if (!workflowName || !nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ 
        error: "workflowName and nodes array are required" 
      });
    }

    const instructions = await generateSetupInstructions(workflowName, nodes);
    
    res.json({
      success: true,
      workflowName,
      instructions
    });

  } catch (error) {
    console.error("Setup instructions error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

app.post("/api/workflow-details", async (req, res) => {
  try {
    const { workflowName, nodes, description } = req.body;
    
    if (!workflowName || !nodes || !Array.isArray(nodes)) {
      return res.status(400).json({ 
        error: "workflowName and nodes array are required" 
      });
    }

    // Generate requirements and detailed info in parallel
    const [requirements, detailedInfo] = await Promise.all([
      generateWorkflowRequirements(workflowName, nodes),
      generateWorkflowInfo(workflowName, nodes)
    ]);
    
    res.json({
      success: true,
      workflowName,
      description: description || `Workflow using ${nodes.slice(0, 3).join(", ")}`,
      requirements,
      detailedInfo,
      nodeCount: nodes.length,
      nodes
    });

  } catch (error) {
    console.error("Workflow details error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 n8n Workflow AI API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
  console.log(`📋 Setup instructions: http://localhost:${PORT}/api/setup-instructions`);
  console.log(`📄 Workflow details: http://localhost:${PORT}/api/workflow-details`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
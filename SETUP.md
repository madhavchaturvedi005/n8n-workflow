# Setup Guide: n8n Workflow Finder

## ✅ Integration Complete!

Your n8n Workflow Finder is now fully integrated with the AI-powered backend. Here's what has been set up:

### 🏗️ Architecture Overview

```
Frontend (React + Vite)     Backend (Node.js + Express)     AI Services
├── Search Interface   ←→   ├── REST API Server        ←→   ├── OpenAI Embeddings
├── Workflow Cards          ├── Search Endpoint             ├── Qdrant Vector DB
├── Results Display         └── Health Check                └── GitHub Raw Files
└── Download Links
```

### 🚀 Quick Start

1. **Start Backend API:**
   ```bash
   cd n8n-workflow-ai
   npm run dev
   ```
   Server runs on: http://localhost:3001

2. **Start Frontend UI:**
   ```bash
   npm run dev
   ```
   UI runs on: http://localhost:8081

3. **Or start both together:**
   ```bash
   ./start-dev.sh
   ```

### 🔧 What's Been Connected

#### Backend Features:
- ✅ Express.js API server with CORS enabled
- ✅ OpenAI embeddings integration for semantic search
- ✅ Qdrant vector database connection
- ✅ Workflow search endpoint (`POST /api/search`)
- ✅ Health check endpoint (`GET /api/health`)
- ✅ Error handling and validation

#### Frontend Features:
- ✅ API service layer for backend communication
- ✅ Real-time search with loading states
- ✅ Connection status indicator in header
- ✅ Error handling with user-friendly messages
- ✅ Workflow download functionality
- ✅ Match scoring display
- ✅ Fallback to sample data if API fails

#### Integration Points:
- ✅ Environment configuration for API URL
- ✅ TypeScript interfaces for API responses
- ✅ Toast notifications for user feedback
- ✅ Proper error boundaries and fallbacks

### 🧪 Testing

Test the API connection:
```bash
cd n8n-workflow-ai
npm run test-api
```

Expected output:
```
✅ Health check: { status: 'ok', message: 'n8n Workflow AI API is running' }
✅ Search results: Found X workflows
🎉 All tests passed! API is working correctly.
```

### 🎯 How It Works

1. **User enters search query** in the frontend
2. **Frontend sends POST request** to `/api/search` with the query
3. **Backend creates embeddings** using OpenAI API
4. **Vector search performed** in Qdrant database
5. **Results transformed** and sent back to frontend
6. **UI displays workflows** with match scores and download links

### 📁 Key Files Added/Modified

#### Backend:
- `n8n-workflow-ai/server.js` - Main API server
- `n8n-workflow-ai/package.json` - Updated with Express and CORS
- `n8n-workflow-ai/test-api.js` - API testing script

#### Frontend:
- `src/services/workflowApi.ts` - API service layer
- `src/pages/Index.tsx` - Updated with real API calls
- `src/components/WorkflowCard.tsx` - Added download functionality
- `.env` - API URL configuration

#### Project:
- `README.md` - Updated with full setup instructions
- `start-dev.sh` - Development startup script

### 🔍 API Endpoints

#### Health Check
```bash
GET http://localhost:3001/api/health
```

#### Search Workflows
```bash
POST http://localhost:3001/api/search
Content-Type: application/json

{
  "query": "email notification workflow"
}
```

Response:
```json
{
  "success": true,
  "query": "email notification workflow",
  "results": [
    {
      "id": "workflow-1",
      "name": "Email Alert Workflow",
      "description": "This workflow uses: Email, Trigger, HTTP",
      "score": 0.85,
      "fileUrl": "https://raw.githubusercontent.com/...",
      "nodeCount": 3,
      "difficulty": "beginner"
    }
  ],
  "count": 1
}
```

### 🎉 Success!

Your n8n Workflow Finder now has:
- Real AI-powered semantic search
- Live connection to Qdrant vector database
- Direct workflow downloads from GitHub
- Professional error handling and user feedback
- Scalable architecture ready for production

The integration is complete and ready for use!
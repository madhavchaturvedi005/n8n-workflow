# n8n Workflow AI Backend

This is the backend API server for the n8n Workflow Finder application. It provides AI-powered search functionality using OpenAI embeddings and Qdrant vector database.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Make sure your `.env` file contains:
   ```
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   OPENAI_API_KEY=your_openai_api_key
   GITHUB_RAW_REFS_BASE=your_github_raw_base_url
   ```

3. **Index workflows (first time setup):**
   ```bash
   npm run store
   ```

4. **Start the API server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/search` - Search workflows
  ```json
  {
    "query": "email notification workflow"
  }
  ```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run store` - Index workflows into Qdrant
- `npm run test-search` - Test search functionality

The server runs on port 3001 by default.
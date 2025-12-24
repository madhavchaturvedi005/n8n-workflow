# 🔍 n8n Workflow Finder

An AI-powered search interface for discovering n8n workflows using semantic search with OpenAI embeddings and Qdrant vector database. Find the perfect automation workflow for your use case with intelligent matching and step-by-step setup guidance.

![n8n Workflow Finder](https://img.shields.io/badge/n8n-Workflow%20Finder-FF6D5A?style=for-the-badge&logo=n8n)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-22.17.0-339933?style=for-the-badge&logo=node.js)

## ✨ Features

### 🤖 **AI-Powered Search**
- **Semantic Matching**: Find workflows based on meaning, not just keywords
- **Top 5 Results**: Curated, most relevant workflow suggestions
- **Match Scoring**: See how well each workflow matches your query
- **LLM-Generated Descriptions**: Clear, user-friendly workflow explanations

### 🎯 **Smart Interface**
- **Typewriter Animation**: Dynamic example prompts to inspire users
- **Custom Logo**: Professional branding with your logo
- **Interactive Examples**: Click to try suggested automation ideas
- **Real-time Search**: Instant results with loading states

### 📋 **Detailed Workflow Information**
- **Toggle View**: Switch between Description and Setup tabs
- **Requirements Analysis**: AI-generated prerequisites and credentials needed
- **Step-by-Step Setup**: Custom instructions tailored to each workflow
- **Direct Downloads**: Access workflow files directly from GitHub

### 🎨 **Modern UI/UX**
- **n8n-Inspired Design**: Purple/magenta theme matching n8n branding
- **Node-Style Components**: Visual elements resembling n8n workflow nodes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Services   │
│   React + Vite  │◄──►│   Node.js +     │◄──►│   OpenAI +      │
│   TypeScript    │    │   Express       │    │   Qdrant DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Stack**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent UI components
- **Framer Motion** for smooth animations
- **React Query** for API state management

### **Backend Stack**
- **Node.js** with Express.js API server
- **OpenAI API** for embeddings and LLM generation
- **Qdrant** vector database for similarity search
- **CORS** enabled for cross-origin requests

### **AI Integration**
- **OpenAI text-embedding-3-large** for semantic search
- **GPT-3.5-turbo** for descriptions and setup instructions
- **Vector similarity search** for relevant workflow matching

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **OpenAI API key** for embeddings and LLM features
- **Qdrant** database (cloud or self-hosted)
- **GitHub** repository access for workflow files

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd n8n-workflow-finder

# Install frontend dependencies
npm install

# Install backend dependencies
cd n8n-workflow-ai
npm install
```

### 2. Environment Configuration

**Backend** (`.env` in `n8n-workflow-ai/`):
```env
QDRANT_URL=https://your-qdrant-instance.com:6333
QDRANT_API_KEY=your_qdrant_api_key
OPENAI_API_KEY=sk-your_openai_api_key
GITHUB_RAW_REFS_BASE=https://raw.githubusercontent.com/djeknet/n8n-master-workflows/refs/heads/master
PORT=3001
```

**Frontend** (`.env` in root):
```env
VITE_API_URL=http://localhost:3001
```

### 3. Index Workflows (First Time Setup)
```bash
cd n8n-workflow-ai
npm run store
```

### 4. Start Development Servers

**Option A: Start Both Servers**
```bash
./start-dev.sh
```

**Option B: Start Individually**
```bash
# Terminal 1: Backend API
cd n8n-workflow-ai
npm run dev

# Terminal 2: Frontend UI
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📖 Usage Guide

### 🔍 **Searching for Workflows**

1. **Type Your Query**: Describe what you want to automate in natural language
   - Example: "Send email notifications when GitHub issues are created"

2. **Use Typewriter Suggestions**: Click on the animated examples or let them inspire your search

3. **Review Results**: Browse the top 5 most relevant workflows with:
   - AI-generated descriptions
   - Match scores (percentage)
   - Node counts and complexity levels
   - Direct download links

### 📋 **Viewing Workflow Details**

Click **"View Setup"** on any workflow to see:

**Description Tab:**
- **Overview**: What the workflow does and who should use it
- **Requirements**: Needed credentials, accounts, and prerequisites
- **How It Works**: Detailed explanation of the workflow logic

**Setup Tab:**
- **Step-by-Step Instructions**: AI-generated setup guide
- **Configuration Tips**: Best practices and common gotchas
- **Testing Guidelines**: How to verify the workflow works

### 💡 **Example Search Queries**

Try these natural language queries:
- "Sync data between Notion and Airtable"
- "Post to social media on schedule"
- "Monitor website uptime and send alerts"
- "Create Trello cards from form submissions"
- "Backup files to Google Drive daily"
- "Send SMS for critical system errors"

## 🛠️ Development

### **Project Structure**
```
n8n-workflow-finder/
├── src/                          # Frontend React application
│   ├── components/               # UI components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── HeroSection.tsx      # Main search interface
│   │   ├── WorkflowResults.tsx  # Search results display
│   │   └── SetupGuide.tsx       # Workflow setup modal
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-typewriter.ts    # Typewriter animation
│   │   └── use-toast.ts         # Toast notifications
│   ├── services/                # API service layer
│   │   └── workflowApi.ts       # Backend API integration
│   └── pages/                   # Application pages
├── n8n-workflow-ai/             # Backend API server
│   ├── server.js                # Express server & API routes
│   ├── searchWorkflow.js        # Search functionality
│   ├── storeInQdrant.js         # Data indexing script
│   └── package.json             # Backend dependencies
├── public/                      # Static assets
│   └── logo.png                 # Custom logo
└── README.md                    # This file
```

### **Available Scripts**

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm start            # Production server
npm run dev          # Development with auto-reload
npm run store        # Index workflows into Qdrant
npm run test-api     # Test API endpoints
```

**Combined:**
```bash
npm run dev:full     # Start both frontend and backend
npm run test:api     # Test backend API health
```

### **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/search` | Search workflows |
| `POST` | `/api/setup-instructions` | Generate setup guide |
| `POST` | `/api/workflow-details` | Get workflow information |

**Example API Usage:**
```bash
# Search for workflows
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "email notification workflow"}'

# Get setup instructions
curl -X POST http://localhost:3001/api/setup-instructions \
  -H "Content-Type: application/json" \
  -d '{"workflowName": "Email Alerts", "nodes": ["emailSend", "trigger"]}'
```

## 🧪 Testing

### **Backend API Testing**
```bash
cd n8n-workflow-ai
npm run test-api
```

Expected output:
```
🧪 Testing n8n Workflow AI API...
✅ Health check: { status: 'ok', message: 'n8n Workflow AI API is running' }
✅ Search results: Found 5 workflows
🎉 All tests passed! API is working correctly.
```

### **Manual Testing Checklist**
- [ ] Typewriter animation cycles through examples
- [ ] Search returns relevant results
- [ ] Setup guide generates instructions
- [ ] Download links work correctly
- [ ] Toggle between Description/Setup tabs
- [ ] Responsive design on mobile
- [ ] Error handling for API failures

## 🚀 Deployment

### **Frontend Deployment**
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### **Backend Deployment**
```bash
cd n8n-workflow-ai
# Set production environment variables
npm start
```

### **Environment Variables for Production**
```env
# Backend
NODE_ENV=production
PORT=3001
QDRANT_URL=your_production_qdrant_url
QDRANT_API_KEY=your_production_api_key
OPENAI_API_KEY=your_openai_api_key

# Frontend
VITE_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Maintain the n8n design system
- Add proper error handling
- Include JSDoc comments for functions
- Test API changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **n8n** for the amazing automation platform
- **OpenAI** for powerful AI capabilities
- **Qdrant** for vector database technology
- **shadcn/ui** for beautiful UI components
- **Framer Motion** for smooth animations

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [n8n Docs](https://docs.n8n.io)
- **Community**: [n8n Community](https://community.n8n.io)

---

**Built with ❤️ for the n8n community**

*Find the perfect workflow, automate with confidence.*
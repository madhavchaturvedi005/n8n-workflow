#!/bin/bash

echo "🚀 n8n Workflow Finder - Backend Deployment Helper"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend/ directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo ""
echo "Before deploying to Render, ensure you have:"
echo "✅ Render account created"
echo "✅ GitHub repository connected"
echo "✅ OpenAI API key ready"
echo "✅ Qdrant database instance running"
echo ""

echo "🔧 Required Environment Variables for Render:"
echo ""
echo "NODE_ENV=production"
echo "PORT=10000"
echo "QDRANT_URL=https://your-qdrant-instance.com:6333"
echo "QDRANT_API_KEY=your_qdrant_api_key"
echo "OPENAI_API_KEY=sk-your_openai_api_key"
echo "GITHUB_RAW_REFS_BASE=https://raw.githubusercontent.com/djeknet/n8n-master-workflows/refs/heads/master"
echo ""

echo "📝 Render Service Configuration:"
echo ""
echo "Service Type: Web Service"
echo "Environment: Node"
echo "Root Directory: backend"
echo "Build Command: npm install"
echo "Start Command: npm start"
echo ""

echo "🌐 Deployment Steps:"
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use the configuration shown above"
echo "5. Add all environment variables"
echo "6. Click 'Create Web Service'"
echo ""

echo "🧪 After deployment, test with:"
echo ""
echo "curl https://your-service-name.onrender.com/api/health"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""

read -p "Press Enter to continue or Ctrl+C to exit..."

echo "🔍 Checking backend configuration..."

# Check if package.json exists
if [ ! -f "backend/package.json" ]; then
    echo "❌ backend/package.json not found"
    exit 1
fi

# Check if server.js exists
if [ ! -f "backend/server.js" ]; then
    echo "❌ backend/server.js not found"
    exit 1
fi

echo "✅ Backend files found"

# Check if environment example exists
if [ -f "backend/.env.example" ]; then
    echo "✅ Environment example file found"
    echo ""
    echo "📄 Environment variables template:"
    cat backend/.env.example
else
    echo "⚠️  No .env.example found in backend/"
fi

echo ""
echo "🎉 Backend is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push any changes to GitHub"
echo "2. Follow the Render deployment steps above"
echo "3. Set up environment variables in Render dashboard"
echo "4. Deploy and test your API"
echo ""
echo "Good luck! 🚀"
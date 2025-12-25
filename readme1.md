# 🚀 Deployment Guide: n8n Workflow Finder

This guide covers deploying the n8n Workflow Finder to production environments.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ **GitHub Repository** with your code
- ✅ **Render Account** (free tier available)
- ✅ **OpenAI API Key** for LLM features
- ✅ **Qdrant Database** (cloud instance)
- ✅ **Environment Variables** ready

## 🌐 Backend Deployment on Render

### Method 1: Using Render Dashboard (Recommended)

#### Step 1: Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/madhavchaturvedi005/n8n-workflow`

#### Step 2: Configure Service Settings
```
Name: n8n-workflow-finder-api
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

#### Step 3: Set Environment Variables
Add these environment variables in Render:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render default |
| `QDRANT_URL` | `https://your-qdrant-url:6333` | Your Qdrant instance |
| `QDRANT_API_KEY` | `your_qdrant_api_key` | Keep secret |
| `OPENAI_API_KEY` | `sk-your_openai_key` | Keep secret |
| `GITHUB_RAW_REFS_BASE` | `https://raw.githubusercontent.com/djeknet/n8n-master-workflows/refs/heads/master` | Workflow source |

#### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Your API will be available at: `https://your-service-name.onrender.com`

### Method 2: Using render.yaml (Infrastructure as Code)

#### Step 1: Update render.yaml
The `render.yaml` file is already configured in your repository. Update the environment variables:

```yaml
services:
  - type: web
    name: n8n-workflow-finder-api
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: QDRANT_URL
        value: YOUR_QDRANT_URL  # Update this
      - key: QDRANT_API_KEY
        value: YOUR_QDRANT_KEY  # Update this
      - key: OPENAI_API_KEY
        value: YOUR_OPENAI_KEY  # Update this
```

#### Step 2: Deploy via Blueprint
1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect repository and select `render.yaml`
4. Review and deploy

## 🎯 Frontend Deployment Options

### Option 1: GitHub Pages (Free)
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
# Enable Pages in repository settings
# Select source: GitHub Actions or branch
```

### Option 2: Render Static Site
1. Create new **"Static Site"** in Render
2. Connect same repository
3. Configure:
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

### Option 3: Vercel/Netlify
- Import repository
- Set build command: `npm run build`
- Set output directory: `dist`

## 🔧 Environment Configuration

### Backend Environment Variables

Create these in your deployment platform:

```env
# Required for production
NODE_ENV=production
PORT=10000

# API Keys (Keep these secret!)
QDRANT_URL=https://your-qdrant-instance.com:6333
QDRANT_API_KEY=your_qdrant_api_key
OPENAI_API_KEY=sk-your_openai_api_key

# Data source
GITHUB_RAW_REFS_BASE=https://raw.githubusercontent.com/djeknet/n8n-master-workflows/refs/heads/master
```

### Frontend Environment Variables

Update your frontend environment:

```env
# Production API URL
VITE_API_URL=https://your-render-service.onrender.com
```

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-service-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "n8n Workflow AI API is running"
}
```

### 2. Search Test
```bash
curl -X POST https://your-service-name.onrender.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "email notification"}'
```

### 3. Frontend Connection
Update your frontend `.env` file:
```env
VITE_API_URL=https://your-service-name.onrender.com
```

## 🔒 Security Considerations

### 1. Environment Variables
- ✅ Never commit API keys to repository
- ✅ Use Render's environment variable system
- ✅ Keep `.env` files in `.gitignore`

### 2. CORS Configuration
The backend is configured to allow your frontend domains:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173']
}));
```

Update the production origins with your actual frontend URL.

### 3. Rate Limiting (Optional)
Consider adding rate limiting for production:
```bash
npm install express-rate-limit
```

## 📊 Monitoring & Maintenance

### Render Features
- ✅ **Automatic Deployments** on git push
- ✅ **Health Checks** and auto-restart
- ✅ **Logs** for debugging
- ✅ **Metrics** for performance monitoring

### Monitoring Checklist
- [ ] Set up health check endpoints
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Monitor OpenAI API usage
- [ ] Check Qdrant database performance

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Render dashboard
# Ensure all dependencies are in package.json
# Verify Node.js version compatibility
```

#### 2. Environment Variable Issues
```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure API keys are valid
```

#### 3. CORS Errors
```bash
# Update CORS origins in server.js
# Add your frontend domain to allowed origins
```

#### 4. Database Connection Issues
```bash
# Verify Qdrant URL and API key
# Check network connectivity
# Ensure Qdrant instance is running
```

### Debug Commands
```bash
# Check service logs
# Available in Render dashboard

# Test API endpoints
curl https://your-service.onrender.com/api/health

# Verify environment variables
# Check in Render service settings
```

## 💰 Cost Optimization

### Render Free Tier
- ✅ **750 hours/month** of runtime
- ✅ **Automatic sleep** after 15 minutes of inactivity
- ✅ **Cold starts** may cause initial delays

### Upgrade Considerations
- **Paid plans** for always-on services
- **Custom domains** available
- **Better performance** and reliability

## 🔄 CI/CD Pipeline

### Automatic Deployments
Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update backend configuration"
git push origin main
# Render will automatically deploy
```

### Manual Deployments
You can also trigger manual deployments from the Render dashboard.

## 📈 Scaling Considerations

### Performance Optimization
- **Caching**: Implement Redis for API responses
- **Database**: Optimize Qdrant queries
- **CDN**: Use for static assets
- **Load Balancing**: For high traffic

### Monitoring Tools
- **Render Metrics**: Built-in monitoring
- **External APM**: New Relic, DataDog
- **Uptime Monitoring**: UptimeRobot, Pingdom

---

## 🎉 Deployment Complete!

Once deployed, your n8n Workflow Finder API will be available at:
`https://your-service-name.onrender.com`

Update your frontend configuration and you're ready to go! 🚀
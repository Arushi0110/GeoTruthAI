# GeoTruthAI - Cloud Deployment Guide

## Architecture
- **Frontend (React/Vite)** → Vercel
- **Backend (Node.js/Express)** → Render
- **AI Service (FastAPI)** → Render
- **Database (MongoDB)** → MongoDB Atlas (Free 512MB)

---

## Prerequisites

1. [GitHub account](https://github.com)
2. [Render account](https://render.com)
3. [Vercel account](https://vercel.com)
4. [MongoDB Atlas account](https://www.mongodb.com/atlas)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster (Shared Tier - M0)
3. Add your IP to the Network Access whitelist
4. Create a database user (username + password)
5. Get your connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/geotruthai?retryWrites=true&w=majority
```

---

## Step 2: Push Code to GitHub

```bash
cd /Users/parulchaudhary/Desktop/Parul/GeoTruthAI
git init
git add .
git commit -m "Initial commit - GeoTruthAI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GeoTruthAI.git
git push -u origin main
```

---

## Step 3: Deploy AI Service to Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `geotruthai-ai`
   - **Runtime**: Python 3
   - **Build Command**: `cd ai-service && pip install -r requirements.txt`
   - **Start Command**: `cd ai-service && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. Note the URL (e.g., `https://geotruthai-ai.onrender.com`)

---

## Step 4: Deploy Backend to Render

1. In Render dashboard → "New +" → "Web Service"
2. Configure:
   - **Name**: `geotruthai-server`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
3. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/geotruthai?retryWrites=true&w=majority
   AI_SERVICE_URL=https://geotruthai-ai.onrender.com
   CLIENT_URL=https://geotruthai.vercel.app
   JWT_SECRET=your-super-secret-jwt-key
   ```
4. Click "Create Web Service"

---

## Step 5: Deploy Frontend to Vercel

### Option A: Vercel CLI
```bash
npm i -g vercel
cd client
vercel
# Follow prompts
# Set environment variable: VITE_API_URL=https://geotruthai-server.onrender.com/api
```

### Option B: Vercel Dashboard
1. Go to https://vercel.com
2. "Add New Project" → Import from GitHub
3. Select `GeoTruthAI` repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://geotruthai-server.onrender.com/api`
6. Click "Deploy"

---

## Step 6: Update Backend CORS (After Frontend Deployed)

Go to Render → geotruthai-server → Environment → Edit
Update `CLIENT_URL` to your Vercel URL (e.g., `https://geotruthai.vercel.app`)

---

## URLs After Deployment

| Service | Example URL |
|---------|-------------|
| Frontend | https://geotruthai.vercel.app |
| Backend API | https://geotruthai-server.onrender.com |
| AI Service | https://geotruthai-ai.onrender.com |
| Health Check | https://geotruthai-server.onrender.com/ |
| AI Health | https://geotruthai-ai.onrender.com/health |

---

## Troubleshooting

**Issue: CORS errors**
- Ensure `CLIENT_URL` in backend matches Vercel URL exactly

**Issue: MongoDB connection failed**
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Check password has no special characters needing URL encoding

**Issue: AI service timeout**
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes ~30s to warm up

**Issue: Frontend can't reach backend**
- Check `VITE_API_URL` ends with `/api`
- Verify backend URL is correct (no trailing slash before `/api`)

---

## Free Tier Limits

| Platform | Limit |
|----------|-------|
| MongoDB Atlas | 512MB storage |
| Render Web Service | 512MB RAM, sleeps after 15 min |
| Vercel | 100GB bandwidth/month |

For production with higher traffic, upgrade to paid plans.


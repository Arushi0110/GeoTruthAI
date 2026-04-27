# GeoTruthAI — Deployment Progress

## ✅ COMPLETED

### 1. Frontend (Vercel) — DEPLOYED
- **URL**: https://geotruthai-client.vercel.app
- **Status**: Live
- **Notes**: Built from `client/` with Vite static build

### 2. GitHub Repository — PUSHED
- **URL**: https://github.com/Arushi0110/GeoTruthAI
- **Branch**: `main`
- **Status**: All deployment configs committed

## ⏳ PENDING (Manual steps required)

### 3. MongoDB Atlas — NEEDS SETUP
1. Go to https://www.mongodb.com/atlas
2. Create free **M0** cluster
3. Add IP `0.0.0.0/0` to Network Access
4. Create database user
5. Copy connection string into Render env var `MONGO_URI`

### 4. Backend (Render) — NEEDS DEPLOYMENT
1. Go to https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect GitHub repo: `Arushi0110/GeoTruthAI`
4. Render auto-detects `render.yaml`
5. Add environment variables in the dashboard:
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret-key>
   AI_SERVICE_URL=https://geotruthai-ai.onrender.com
   CLIENT_URL=https://geotruthai-client.vercel.app
   ```

### 4. AI Service (Render) — NEEDS DEPLOYMENT
1. In Render dashboard → **New +** → **Web Service**
2. Connect same GitHub repo
3. Configure:
   - **Name**: `geotruthai-ai`
   - **Runtime**: Python 3
   - **Build Command**: `cd ai-service && pip install -r requirements.txt`
   - **Start Command**: `cd ai-service && uvicorn main:app --host 0.0.0.0 --port $PORT`

### 5. Database (MongoDB Atlas) — NEEDS SETUP
1. Go to https://www.mongodb.com/atlas
2. Create free **M0** cluster
3. Add IP `0.0.0.0/0` to Network Access
4. Create database user
5. Copy connection string into Render env var `MONGO_URI`

## 🌐 Live URLs After Full Deployment

| Service      | URL                                                        | Status |
|--------------|------------------------------------------------------------|--------|
| Frontend     | https://geotruthai-client.vercel.app                       | ✅     |
| Backend      | https://geotruthai-server.onrender.com                     | ⏳     |
| AI Service   | https://geotruthai-ai.onrender.com                         | ⏳     |

## 💰 Cost
**$0/month** — all services on free tiers.


# GeoTruthAI - Deployment TODO

## Current Status: Deployment Configuration Complete ✅

### Files Created/Updated:
- ✅ `server/server.js` - Production CORS (multi-origin support)
- ✅ `client/src/services/api.js` - Vite env variable for API URL
- ✅ `client/vercel.json` - Vercel deployment config
- ✅ `render.yaml` - Render blueprints (server + AI + static)
- ✅ `DEPLOYMENT.md` - Step-by-step deployment guide
- ✅ `.env.example` - Full env variable documentation

---

## Next Steps (Manual - Requires User Accounts):

### 1️⃣ MongoDB Atlas (Database)
- [ ] Sign up: https://www.mongodb.com/atlas
- [ ] Create free M0 cluster
- [ ] Add IP `0.0.0.0/0` to Network Access
- [ ] Create database user (save password!)
- [ ] Copy connection string to `.env` `MONGO_URI`

### 2️⃣ Push to GitHub
- [ ] Create GitHub repo: `GeoTruthAI`
- [ ] `git init && git add . && git commit -m "initial"`
- [ ] `git remote add origin https://github.com/YOUR_USERNAME/GeoTruthAI.git`
- [ ] `git push -u origin main`

### 3️⃣ Deploy AI Service (Render)
- [ ] Sign up: https://render.com
- [ ] New Web Service → Python
- [ ] Root: `ai-service`
- [ ] Build: `pip install -r requirements.txt`
- [ ] Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Note the URL (e.g., `https://geotruthai-ai.onrender.com`)

### 4️⃣ Deploy Backend (Render)
- [ ] New Web Service → Node
- [ ] Root: `server`
- [ ] Build: `npm install`
- [ ] Start: `node server.js`
- [ ] Env vars:
  - `MONGO_URI=<Atlas URI>`
  - `AI_SERVICE_URL=<AI service URL>`
  - `CLIENT_URL=<Vercel URL>`
  - `JWT_SECRET=<random secret>`

### 5️⃣ Deploy Frontend (Vercel)
- [ ] Sign up: https://vercel.com
- [ ] Import from GitHub
- [ ] Framework: Vite, Root: `client`
- [ ] Env var: `VITE_API_URL=<Render backend URL>/api`

### 6️⃣ Test Live Site
- [ ] Visit Vercel URL
- [ ] Submit test news → AI analysis
- [ ] Check heatmap loads
- [ ] Vote works

---

## Architecture Summary
- **Frontend**: React/Vite → Vercel (Free CDN)
- **Backend**: Node/Express → Render (Free, sleeps after 15min idle)
- **AI Service**: FastAPI → Render (Free, sleeps after 15min idle)
- **Database**: MongoDB Atlas → M0 Free Tier (512MB)

### Estimated Monthly Cost (Free Tiers):
| Service  | Cost  | Limit                          |
|----------|-------|--------------------------------|
| Vercel   | $0    | 100GB bandwidth                |
| Render   | $0    | 512MB RAM, sleeps after 15min  |
| MongoDB  | $0    | 512MB storage, shared CPU      |
| **Total** | **$0**| Perfect for MVP/demos          |


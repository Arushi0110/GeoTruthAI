# GeoTruthAI 🚀

AI-powered Fake News Detection with Geolocation, Crowd Verification & Heatmap Dashboard.

## 🏗️ Architecture
- **Frontend**: React + Tailwind + Google Maps (Modules 1,4,5,7,8)
- **Backend**: Node/Express + MongoDB (Modules 1,4,5,6)
- **AI Service**: Python/FastAPI + HuggingFace BERT + OpenCV (Modules 2,3)

## 🚀 Quick Start (Development)

1. Clone & Install:
```bash
git clone <repo>
cd GeoTruthAI
npm run setup  # npm + workspaces
cd ai-service
pip install -r requirements.txt
cd ..
cp .env.example .env  # Edit keys
```

2. Start Services:
```bash
# Dev (local)
npm run dev

# Or Docker (recommended)
npm run docker:up
# Client: http://localhost:3000
# Server: http://localhost:5000
# AI: http://localhost:8000
```

3. Test Flow:
- Submit news/image → AI detects → Vote → Trust Score → Heatmap updates

## 📁 Structure
```
.
├── client/         # React frontend
├── server/         # Node API
├── ai-service/     # Python AI
├── docker-compose.yml
└── ...
```

## 🔑 Setup Keys
- **Google Maps**: [Console](https://console.cloud.google.com) → Maps JS API
- **MongoDB**: Local or [Atlas](https://mongodb.com/atlas)

## 🧪 Testing
- POST http://localhost:5000/api/news {text: '...'}
- Visit http://localhost:3000 → Submit form

## 📈 Modules Implemented
1. User Input ✅
2. AI NLP ✅
3. Image Verify ✅
4. Geolocation ✅
5. Crowd Votes ✅
6. Trust Score ✅
7. Heatmap ✅
8. Alerts ✅

Built with ❤️ by BLACKBOXAI


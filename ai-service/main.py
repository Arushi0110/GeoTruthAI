from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import traceback
import random
import re

app = FastAPI(title="GeoTruthAI AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image_url: str

@app.post("/detect-text")
async def detect_text(request: TextRequest):
    try:
        text = request.text.lower()
        fake_score = sum(1 for word in ['fake', 'hoax', 'viral', 'shocking', 'breaking'] if word in text)
        confidence = min(0.9, 0.4 + fake_score * 0.1)
        label = 'fake' if fake_score > 1 else 'real'
        return {
            "label": label,
            "confidence": float(confidence),
            "explanation": f"Text indicators detected: {fake_score}"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/verify-image")
async def verify_image(request: ImageRequest):
    try:
        score = round(random.uniform(0.6, 0.95), 2)
        return {
            "score": score,
            "isReused": random.choice([False, True]),
            "explanation": f"Demo image analysis: {score*100:.0f}% authentic"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/health")
async def health():
    return {"status": "healthy", "services": "text+image analysis ready"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


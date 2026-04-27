from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Example request model
class NewsItem(BaseModel):
    text: str

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "GeoTruthAI backend is running!"}

# Example endpoint for fake news detection
@app.post("/predict")
def predict(news: NewsItem):
    # For now, just echo the input
    return {"text": news.text, "prediction": "Not implemented yet"}
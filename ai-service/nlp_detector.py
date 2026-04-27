import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re
from sentence_transformers import SentenceTransformer

# Rule-based + lightweight fallback for demo (no heavy model download)
class NLPDdetector:
    def __init__(self):
        print("Loading lightweight Fake News detector...")
        self.model_name = "roberta-base"
        try:
            self.encoder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        except:
            self.encoder = None
            print("Using pure rule-based (no sentence-transformers)")
        
    def preprocess(self, text):
        text = re.sub(r'http\\S+', '', text)
        text = re.sub(r'[^a-zA-Z0-9\\s]', '', text)
        return text.lower().strip()

    def analyze_text(self, text):
        processed_text = self.preprocess(text)
        
        # Rule-based detection
        fake_indicators = ['fake news', 'hoax', 'viral', 'shocking', 'breaking', 'unverified', 'sensational']
        real_indicators = ['official', 'confirmed', 'verified', 'reuters', 'ap', 'bbc']
        
        fake_score = sum(1 for indicator in fake_indicators if indicator in processed_text)
        real_score = sum(1 for indicator in real_indicators if indicator in processed_text)
        
        # Simple logic
        if len(processed_text.split()) > 5:
            confidence = min(0.85, 0.5 + fake_score * 0.1 - real_score * 0.08)
            pred = 1 if fake_score > real_score else 0
        else:
            pred = 0
            confidence = 0.6
        
        labels = ['real', 'fake']
        
        return {
            "label": labels[pred],
            "confidence": float(confidence),
            "explanation": f"Rule-based analysis (fake_score: {fake_score}, real_score: {real_score})"
        }

detector = NLPDdetector()

def analyze_text(text):
    return detector.analyze_text(text)


import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re
from sentence_transformers import SentenceTransformer

class NLPDdetector:
    def __init__(self):
        print("Loading Fake News model...")
        model_name = "cardiffnlp/twitter-roberta-base-fake"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.encoder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        
    def preprocess(self, text):
        text = re.sub(r'http\\S+', '', text)
        text = re.sub(r'[^a-zA-Z0-9\\s]', '', text)
        return text.lower().strip()

    def analyze_text(self, text):
        processed_text = self.preprocess(text)
        
        fake_indicators = ['fake news', 'hoax', 'viral', 'shocking', 'breaking']
        is_suspicious = any(indicator in processed_text for indicator in fake_indicators)
        
        try:
            inputs = self.tokenizer(processed_text, return_tensors="pt", truncation=True, padding=True, max_length=512)
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
                pred = torch.argmax(probs, dim=-1).item()
        except:
            pred = 1 if is_suspicious else 0
            probs = torch.tensor([0.5, 0.5])
            
        labels = ['real', 'fake']
        confidence = probs.max().item()
        
        if is_suspicious:
            pred = 1
            confidence = min(0.9, confidence + 0.2)
        
        return {
            "label": labels[pred],
            "confidence": float(confidence),
            "explanation": "AI analysis + rule-based heuristics"
        }

detector = NLPDdetector()

def analyze_text(text):
    return detector.analyze_text(text)

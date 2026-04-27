#!/bin/bash
set -e

echo "🚀 Setting up GeoTruthAI..."

# Copy env
cp .env.example .env
echo "✅ .env copied - EDIT YOUR GOOGLE_MAPS_API_KEY!"

# Install Node deps
echo "📦 Installing Node dependencies..."
npm ci

cd client && npm ci && cd ..
cd server && npm ci && cd ..

# Install Python deps
echo "🐍 Installing Python dependencies..."
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "🎉 Setup complete!"
echo "Next steps:"
echo "1. Edit .env (Google Maps API key)"
echo "2. npm run dev  # or docker-compose up"
echo "3. Visit http://localhost:3000"


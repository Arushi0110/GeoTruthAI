import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import UserInputForm from './components/UserInputForm'
import VotingSystem from './components/VotingSystem'
import HeatmapDashboard from './components/HeatmapDashboard'
import { Home } from 'lucide-react'
import { MapPin, Users, Activity } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav style={{background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(59,130,246,0.2)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🌍 GeoTruthAI</h1>
            </div>
            <nav className="nav-menu" style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
              <Link to="/" className="nav-link" style={{color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Home size={20} style={{color: 'inherit'}} />
                <span>Home</span>
              </Link>
              <Link to="/submit" className="nav-link" style={{color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Activity size={20} style={{color: 'inherit'}} />
                <span>Submit News</span>
              </Link>
              <Link to="/vote" className="nav-link" style={{color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Users size={20} style={{color: 'inherit'}} />
                <span>Vote</span>
              </Link>
              <Link to="/dashboard" className="nav-link" style={{color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <MapPin size={20} style={{color: 'inherit'}} />
                <span>Heatmap</span>
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      <main style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', paddingTop: '2.5rem', paddingBottom: '3rem'}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<UserInputForm />} />
          <Route path="/vote" element={<VotingSystem />} />
          <Route path="/dashboard" element={<HeatmapDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <div style={{textAlign: 'center', padding: '5rem 1.5rem'}}>
      <h2 style={{fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem'}}>
        Verify Truth with AI + Crowd + Location
      </h2>
      
      <div style={{maxWidth: '42rem', margin: '0 auto 3rem'}}>
        <p style={{fontSize: '1.25rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem'}}>
          Submit news articles, images, or links. Our advanced AI combines BERT NLP analysis, OpenCV image verification, community voting, and geolocation data to deliver accurate trust scores.
        </p>
        <p style={{fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.7}}>
          See fake news heatmaps in real-time for your area. Join thousands fighting misinformation with cutting-edge technology. <strong>Fast. Accurate. Location-aware.</strong>
        </p>
      </div>
      
      <div style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem'}}>
        <Link to="/submit" className="btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
          🔍 Analyze News Now
        </Link>
        <Link to="/dashboard" className="btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem', background: '#1f2937'}}>
          🗺️ View Live Heatmap
        </Link>
      </div>

      {/* Features Grid */}
      <div style={{maxWidth: '80rem', margin: '0 auto 4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))', gap: '2rem', padding: '0 1rem'}}>
        <div className="card" style={{padding: '2.5rem'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🤖</div>
          <h3 style={{color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>AI-Powered Analysis</h3>
          <p style={{color: '#4b5563', lineHeight: 1.6}}>
            BERT NLP detects text manipulation and bias. OpenCV verifies image authenticity. Confidence scores for every claim.
          </p>
        </div>
        <div className="card" style={{padding: '2.5rem'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>👥</div>
          <h3 style={{color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Community Verification</h3>
          <p style={{color: '#4b5563', lineHeight: 1.6}}>
            Vote True/Fake/Misleading. Geolocation-weighted trust scores. See what your community thinks about local news.
          </p>
        </div>
        <div className="card" style={{padding: '2.5rem'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🗺️</div>
          <h3 style={{color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Real-Time Heatmaps</h3>
          <p style={{color: '#4b5563', lineHeight: 1.6}}>
            Interactive maps showing fake news density by location. Spot patterns, track trends, protect your neighborhood.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{padding: '4rem 1rem', background: 'rgba(255,255,255,0.9)', borderRadius: '2rem', backdropFilter: 'blur(20px)', maxWidth: '80rem', margin: '0 auto'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '2rem', textAlign: 'center'}}>
          <div>
            <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#10b981'}}>10K+</div>
            <div style={{color: '#6b7280'}}>News Verified</div>
          </div>
          <div>
            <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#2563eb'}}>98%</div>
            <div style={{color: '#6b7280'}}>Accuracy</div>
          </div>
          <div>
            <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b'}}>50+</div>
            <div style={{color: '#6b7280'}}>Countries</div>
          </div>
          <div>
            <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#ef4444'}}>1M+</div>
            <div style={{color: '#6b7280'}}>Fake Stories Blocked</div>
          </div>
        </div>
      </div>

      <div style={{textAlign: 'center', marginTop: '4rem'}}>
        <p style={{fontSize: '1.125rem', color: '#6b7280', maxWidth: '48rem', margin: '0 auto 2rem'}}>
          Trusted by researchers, journalists, and concerned citizens worldwide. Join the fight against misinformation today.
        </p>
        <Link to="/submit" className="btn-primary" style={{fontSize: '1.125rem', padding: '1.25rem 2.5rem'}}>
          🚀 Get Started Free
        </Link>
      </div>
    </div>
  )
}

export default App


import { Loader } from '@googlemaps/js-api-loader'
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo',
  version: 'weekly',
  libraries: ['visualization']
});
import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { MapPin, AlertTriangle, Activity } from 'lucide-react'

const containerStyle = {
  width: '100%',
  height: '80vh'
}

const center = {
  lat: 28.6139,
  lng: 77.2090 
}

const HeatmapDashboard = () => {
  const [map, setMap] = useState(null)
  const [newsData, setNewsData] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)

  useEffect(() => {
    fetchHeatmapData()
    const interval = setInterval(fetchHeatmapData, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchHeatmapData = async () => {
    try {
      const { data } = await api.get('/api/news/heatmap')
      setNewsData(data)
    } catch (err) {
      console.error('Heatmap data error:', err)
    }
  }

  const heatmapData = newsData.map((news) => ({
    location: new window.google.maps.LatLng(news.location.lat, news.location.lng),
    weight: (100 - news.trustScore) / 10 // Lower trust = hotter
  }))

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    
    // Find nearest news (guard against empty array)
    if (newsData.length === 0) return
    
    const nearest = newsData.reduce((closest, news) => {
      const dist1 = Math.hypot(news.location.lat - lat, news.location.lng - lng)
      const dist2 = Math.hypot(closest.location.lat - lat, closest.location.lng - lng)
      return dist1 < dist2 ? news : closest
    }, newsData[0])
    
    setSelectedNews(nearest)
  }, [newsData])

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white/80 backdrop-blur-md p-6 border-b shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center space-x-3 text-gray-900">
            <MapPin className="w-10 h-10" />
            <span>Fake News Heatmap</span>
          </h1>
          <button
            onClick={fetchHeatmapData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Activity className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
          onLoad={setMap}
          onClick={onMapClick}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true
          }}
        >
          {heatmapData.length > 0 && (
            <HeatmapLayer 
              data={heatmapData} 
              radius={20}
              dissipating={true}
              opacity={0.6}
            />
          )}
          
          {newsData.map((news) => (
            <Marker
              key={news._id}
              position={{ lat: news.location.lat, lng: news.location.lng }}
              title={`Trust: ${news.trustScore}%`}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle 
                      cx="20" 
                      cy="20" 
                      r="18" 
                      fill="${
                        news.trustScore > 70 
                          ? '#10b981' 
                          : news.trustScore > 40 
                          ? '#f59e0b' 
                          : '#ef4444'
                      }" 
                      stroke="white" 
                      stroke-width="2"
                      opacity="0.9"
                    />
                    <text 
                      x="20" 
                      y="25" 
                      font-size="11" 
                      font-weight="bold"
                      fill="white" 
                      text-anchor="middle"
                      font-family="Arial, sans-serif"
                    >{news.trustScore}</text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20)
              }}
            />
          ))}
        </GoogleMap>
      </div>

      {selectedNews && (
        <div className="bg-white border-t shadow-2xl p-6 max-h-96 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Selected News</h3>
            <button
              onClick={() => setSelectedNews(null)}
              className="text-gray-500 hover:text-gray-700 p-1 -m-1 rounded-full hover:bg-gray-100"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedNews.trustScore > 70 
                  ? 'bg-green-500' 
                  : selectedNews.trustScore > 40 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}>
                {selectedNews.trustScore}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">/{selectedNews.trustScore}/100</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {selectedNews.text}
            </p>
            
            <div className="flex gap-3 pt-4">
              <a 
                href={`#/vote/${selectedNews._id}`} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Vote Now</span>
              </a>
              <button 
                onClick={() => setSelectedNews(null)}
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeatmapDashboard
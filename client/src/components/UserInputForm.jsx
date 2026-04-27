import { useState, useRef } from 'react'
import api from '../services/api'
import { Upload, Link, FileText, Send, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react'

const UserInputForm = () => {
  const [formData, setFormData] = useState({
    text: '',
    image: null,
    link: '',
    location: null
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const fileInputRef = useRef(null)

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })
        setFormData(prev => ({ ...prev, location: { lat: latitude, lng: longitude } }))
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location.')
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    
    try {
      const data = new FormData()
      data.append('text', formData.text)
      data.append('link', formData.link)
      if (formData.image) data.append('image', formData.image)
      if (formData.location) {
        data.append('lat', formData.location.lat)
        data.append('lng', formData.location.lng)
      }

      const response = await api.post('/api/news', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })


      
      setResult(response.data)
    } catch (error) {
      console.error('Submit error:', error)
      alert(error.response?.data?.message || 'Error submitting news for verification')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB')
      e.target.value = ''
      return
    }
    setFormData({ ...formData, image: file })
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearLocation = () => {
    setCurrentLocation(null)
    setFormData({ ...formData, location: null })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Verify News
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit news content for AI-powered truth verification
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
          {/* News Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              News Content
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              rows={5}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-vertical min-h-[120px] text-gray-900 placeholder-gray-500 text-base leading-relaxed"
              placeholder="Paste the news article text, headline, or description here..."
              required
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-green-600" />
                Image Upload (Optional)
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-5 border-2 border-dashed border-gray-300 rounded-2xl file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100 transition-all duration-200 cursor-pointer hover:border-blue-300"
                />
                
                {formData.image && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {formData.image.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Link & Location */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Link className="w-6 h-6 mr-3 text-purple-600" />
                  Source Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="https://example.com/news-article"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-orange-600" />
                  Location (Optional)
                </label>
                <div className="space-y-2">
                  {!currentLocation ? (
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Use My Location</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">
                            Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                          </p>
                          <p className="text-sm text-blue-700">Your current location</p>
                        </div>
                      </div>
                      <button
                        onClick={clearLocation}
                        className="text-blue-600 hover:text-blue-800 p-2 -m-2 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.text.trim()}
            className={`w-full text-xl py-6 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl ${
              loading || !formData.text.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-2xl active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-7 h-7" />
                <span>Verify Truth Score</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-12 p-8 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-3xl border-4 border-white/50 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Analysis Complete ✅
              </h3>
              <button
                onClick={() => setResult(null)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-2xl hover:bg-gray-200 transition-all"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Trust Score */}
              <div className="text-center p-8 bg-white/60 rounded-2xl backdrop-blur-sm border">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg"
                  style={{
                    background: `conic-gradient(from 0deg, #10b981 ${result.trustScore}%, #ef4444 ${result.trustScore}%)`
                  }}
                >
                  <div className="w-20 h-20 bg-white/90 rounded-xl flex items-center justify-center font-bold text-2xl text-gray-900">
                    {result.trustScore}%
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Trust Score</h4>
                <p className="text-4xl font-black text-gray-900">/{result.trustScore}/100</p>
              </div>

              {/* AI Analysis */}
              <div className="space-y-4">
                <div className="p-6 bg-white/70 rounded-2xl backdrop-blur-sm border">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    🤖 AI Analysis
                  </h5>
                  <p className="text-lg font-bold text-gray-900">
                    {result.aiResult?.label || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {result.aiResult?.confidence || 0}%
                  </p>
                </div>

                {result.imageResult && (
                  <div className="p-6 bg-white/70 rounded-2xl backdrop-blur-sm border">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      🖼️ Image Analysis
                    </h5>
                    <p className="text-lg font-bold text-gray-900">
                      {result.imageResult.score}% Authentic
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInputForm
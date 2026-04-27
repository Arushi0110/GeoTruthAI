import axios from 'axios'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

const aiService = {
  analyzeText: async (text) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/detect-text`, { text }, {
        timeout: 30000
      })
      return response.data
    } catch (error) {
      console.error('Text AI error:', error.response?.data || error.message)
      // Fallback mock
      return {
        label: 'fake',
        confidence: 0.65
      }
    }
  },

  verifyImage: async (imageUrl) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/verify-image`, { imageUrl }, {
        timeout: 30000
      })
      return response.data
    } catch (error) {
      console.error('Image AI error:', error.response?.data || error.message)
      // Fallback
      return { score: 0.8, isReused: false }
    }
  }
}

export default aiService


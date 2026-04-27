import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const newsAPI = {
  submitNews: (data) => api.post('/news', data),
  getNews: (id) => api.get(`/news/${id}`),
}

export const voteAPI = {
  submitVote: (newsId, vote) => api.post(`/votes/${newsId}`, { vote }),
  getVotes: (newsId) => api.get(`/votes/${newsId}`),
}

export default api


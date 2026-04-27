import { useState, useEffect } from 'react'
import { Users, CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react'
import voteAPI from '../services/api'

const VotingSystem = () => {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data } = await api.get('/api/news')
      setNewsList(data.slice(0, 5)) // Recent 5
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (newsId, vote) => {
    try {
      await voteAPI.submitVote(newsId, vote)
      fetchNews() // Refresh
    } catch (err) {
      alert('Vote failed')
    }
  }

  const VoteButton = ({ newsId, voteType, label, icon: Icon, color }) => (
    <button
      onClick={() => handleVote(newsId, voteType)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${color} shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )

  if (loading) return <div className="text-center py-12">Loading news...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center flex items-center justify-center space-x-3">
        <Users className="w-12 h-12" />
        <span>Community Verification</span>
      </h1>

      <div className="space-y-8">
        {newsList.map((news) => (
          <div key={news._id} className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{news.text?.substring(0, 100)}...</h3>
              <div className="text-right">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border">
                  Trust: {news.trustScore}/100
                </div>
                <p className="text-sm text-gray-500 mt-1">Votes: {news.votes?.true || 0}T / {news.votes?.fake || 0}F / {news.votes?.misleading || 0}M</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <VoteButton 
                newsId={news._id} 
                voteType="true" 
                label="True" 
                Icon={CheckCircle}
                color="bg-green-500 hover:bg-green-600 text-white" 
              />
              <VoteButton 
                newsId={news._id} 
                voteType="fake" 
                label="Fake" 
                Icon={XCircle}
                color="bg-red-500 hover:bg-red-600 text-white" 
              />
              <VoteButton 
                newsId={news._id} 
                voteType="misleading" 
                label="Misleading" 
                Icon={AlertTriangle}
                color="bg-orange-500 hover:bg-orange-600 text-white" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VotingSystem


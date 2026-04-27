import News from '../models/News.js'
import Vote from '../models/Vote.js'

// Module 6: Trust Score Engine
const calculateTrustScore = async (news) => {
  let aiScore = 0
  let imageScore = 0
  let crowdScore = 0

  // AI Score (Module 2) - 50%
  if (news.aiResult) {
    const confidence = news.aiResult.confidence || 0
    aiScore = news.aiResult.label === 'real' ? confidence * 100 : (1 - confidence) * 100
  }

  // Image Score (Module 3) - 20%
  if (news.imageResult) {
    imageScore = news.imageResult.score * 100
  }

  // Crowd Score (Module 5) - 30%
  const votes = await Vote.aggregate([
    { $match: { newsId: news._id } },
    {
      $group: {
        _id: '$vote',
        count: { $sum: 1 }
      }
    }
  ])

  const totalVotes = votes.reduce((sum, v) => sum + v.count, 0)
  if (totalVotes > 0) {
    const trueVotes = votes.find(v => v._id === 'true')?.count || 0
    const fakeVotes = votes.find(v => v._id === 'fake')?.count || 0
    const misleadingVotes = votes.find(v => v._id === 'misleading')?.count || 0
    
    crowdScore = ((trueVotes * 1 + fakeVotes * 0 + misleadingVotes * 0.5) / totalVotes) * 100
  }

  // Weighted formula
  const trustScore = Math.round(
    (0.5 * aiScore) + 
    (0.2 * imageScore) + 
    (0.3 * crowdScore)
  )

  return Math.max(0, Math.min(100, trustScore))
}

export default calculateTrustScore


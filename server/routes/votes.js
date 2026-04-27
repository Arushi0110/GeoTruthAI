import express from 'express'
import Vote from '../models/Vote.js'
import News from '../models/News.js'
import calculateTrustScore from '../controllers/trustScore.js'
import { io, updateClients } from '../server.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Submit vote (Module 5)
router.post('/:newsId', authMiddleware, async (req, res) => {
  try {
    const { newsId } = req.params
    const { vote } = req.body
    const userId = req.user.id

    // Check if user already voted
    const existingVote = await Vote.findOne({ newsId, userId })
    if (existingVote) {
      return res.status(400).json({ message: 'Already voted on this news' })
    }

    // Create vote
    const newVote = new Vote({ newsId, userId, vote })
    await newVote.save()

    // Update news votes array & recalculate trust score
    const news = await News.findById(newsId)
    if (!news) return res.status(404).json({ message: 'News not found' })

    news.votes.push(newVote._id)
    news.trustScore = await calculateTrustScore(news)
    await news.save()

    // Realtime update (Module 8)
    updateClients(newsId)

    res.json({
      success: true,
      message: 'Vote recorded',
      trustScore: news.trustScore,
      voteCount: news.votes.length
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
})

// Get votes for news
router.get('/:newsId', async (req, res) => {
  try {
    const { newsId } = req.params
    const votes = await Vote.find({ newsId }).populate('userId', 'name')
    res.json(votes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router


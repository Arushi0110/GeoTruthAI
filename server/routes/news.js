import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { promisify } from 'util'
import News from '../models/News.js'
import aiService from '../services/aiService.js'
import mongoose from 'mongoose'
import { getGeoFromIP } from '../utils/geo.js'
import { updateClients } from '../server.js'

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

// Submit news (Module 1)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { text, link, lat, lng } = req.body
    
    // Mock userId (implement auth later)
    const userId = new mongoose.Types.ObjectId()
    
    // Location fallback
    let location = {}
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      location = { lat: parseFloat(lat), lng: parseFloat(lng) }
    } else {
      const ipLocation = await getGeoFromIP(req.ip)
      location = ipLocation || { lat: 0, lng: 0 }
    }

    const newsData = {
      text,
      link: link || null,
      location,
      userId,
      status: 'pending'
    }

    // Upload image if present
    if (req.file) {
      const uploadPromise = promisify(cloudinary.uploader.upload_stream)
      const result = await uploadPromise({ folder: 'geotruthai/news' }, (error, result) => result)
      newsData.image = result.secure_url
    }

    const news = new News(newsData)
    await news.save()

    // Async AI analysis (Modules 2,3)
    ;(async () => {
      try {
        const aiResult = await aiService.analyzeText(text)
        const imageResult = news.image ? await aiService.verifyImage(news.image) : null
        
        news.aiResult = aiResult
        news.imageResult = imageResult
        news.status = 'analyzed'
        await news.save()

        await updateClients(news._id.toString())
      } catch (aiErr) {
        console.error('AI Analysis failed:', aiErr)
      }
    })()

    res.status(201).json({
      success: true,
      newsId: news._id,
      message: 'News submitted for analysis'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get news for heatmap
router.get('/heatmap', async (req, res) => {
  try {
    const news = await News.find({}).select('location trustScore text _id').limit(100)
    res.json(news)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('votes')
    if (!news) return res.status(404).json({ message: 'News not found' })
    res.json(news)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router


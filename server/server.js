import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { Server } from 'socket.io'
import http from 'http'

import newsRoutes from './routes/news.js'
import voteRoutes from './routes/votes.js'
import News from './models/News.js'
import calculateTrustScore from './controllers/trustScore.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS origin from env (supports multiple origins comma-separated)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,https://geotruthai-client.vercel.app').split(',').map(o => o.trim())

// Middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // In dev, allow localhost
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static('uploads'))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})
app.use('/api/', limiter)

// DB Connect
const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/news', newsRoutes)
app.use('/api/votes', voteRoutes)

// Socket.io for realtime updates
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (newsId) => {
    socket.join(newsId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const updateClients = async (newsId) => {
  const news = await News.findById(newsId).populate('votes')
  const trustScore = await calculateTrustScore(news)
  await News.findByIdAndUpdate(newsId, { trustScore })

  io.to(newsId).emit('trust-score-update', { newsId, trustScore, news })
}

export { io, updateClients }

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('🚀 GeoTruthAI Server is running!')
})


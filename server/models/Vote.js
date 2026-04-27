import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {
    type: String,
    enum: ['true', 'fake', 'misleading'],
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Prevent duplicate votes
voteSchema.index({ newsId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Vote', voteSchema)


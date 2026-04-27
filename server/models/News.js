import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 5000
  },
  image: {
    type: String, // URL/path
    default: null
  },
  link: {
    type: String,
  },
  location: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiResult: {
    label: { type: String, enum: ['real', 'fake', 'misleading'] },
    confidence: { type: Number, min: 0, max: 1 }
  },
  imageResult: {
    score: { type: Number, min: 0, max: 1 }, // authenticity
    isReused: { type: Boolean }
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote'
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'verified'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model('News', newsSchema)


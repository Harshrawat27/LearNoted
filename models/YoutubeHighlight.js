import mongoose from 'mongoose';

const YouTubeTimestampSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoTitle: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number, // Time in seconds
    required: true,
  },
  formattedTime: {
    type: String, // e.g., "12:34"
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes a User model exists
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.YouTubeTimestamp ||
  mongoose.model('YouTubeTimestamp', YouTubeTimestampSchema);

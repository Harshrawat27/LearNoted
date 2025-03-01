// backend/models/Timestamp.js
import mongoose from 'mongoose';

// Define schema for individual timestamps
const TimestampSchema = new mongoose.Schema({
  time: {
    type: Number, // Time in seconds
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define schema for videos that contain timestamps
const VideoSchema = new mongoose.Schema({
  videoId: {
    type: String, // YouTube video ID
    required: true,
    unique: true,
  },
  title: {
    type: String, // Video title (optional)
    default: '',
  },
  timestamps: [TimestampSchema], // Array of timestamps for this video
  userId: {
    type: String, // For user-specific timestamps if you implement authentication
    default: 'anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
VideoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create models if they don't exist, or use existing ones
export const Timestamp =
  mongoose.models.Timestamp || mongoose.model('Timestamp', TimestampSchema);
export const Video =
  mongoose.models.Video || mongoose.model('Video', VideoSchema);

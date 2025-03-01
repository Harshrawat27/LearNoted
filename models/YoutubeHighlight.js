// models/YoutubeHighlight.js
import mongoose from 'mongoose';

const TimestampSchema = new mongoose.Schema({
  time: {
    type: Number,
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

const VideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: false, // Changed from true to false to allow multiple users per video
  },
  title: {
    type: String,
    default: '',
  },
  timestamps: [TimestampSchema],
  userId: {
    type: String,
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

VideoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Timestamp =
  mongoose.models.Timestamp || mongoose.model('Timestamp', TimestampSchema);
export const Video =
  mongoose.models.Video || mongoose.model('Video', VideoSchema);

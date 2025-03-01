import mongoose from 'mongoose';

const TimestampSchema = new mongoose.Schema({
  timestamp: String,
  formattedTime: String,
  comment: String,
});

const YouTubeTimestampSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  videoUrl: String,
  videoTitle: String,
  userId: { type: String, required: true },
  timestamps: [TimestampSchema],
});

export default mongoose.models.YouTubeTimestamp ||
  mongoose.model('YouTubeTimestamp', YouTubeTimestampSchema);

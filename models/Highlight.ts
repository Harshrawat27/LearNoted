import mongoose from 'mongoose';

const HighlightSchema = new mongoose.Schema({
  userEmail: {
    // Changed from userId to userEmail
    type: String,
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
    index: true,
  },
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    enum: ['yellow', 'green', 'blue', 'pink', 'purple'],
  },
  context: {
    type: String,
    required: true,
  },
  position: {
    start: Number,
    end: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Highlight ||
  mongoose.model('Highlight', HighlightSchema);

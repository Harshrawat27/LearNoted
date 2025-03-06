import mongoose from 'mongoose';

const HighlightSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    enum: ['yellow', 'green', 'blue', 'pink', 'purple'],
    default: 'yellow',
  },
  context: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for efficient queries
HighlightSchema.index({ userEmail: 1, url: 1 });

const Highlight =
  mongoose.models.Highlight || mongoose.model('Highlight', HighlightSchema);

export default Highlight;

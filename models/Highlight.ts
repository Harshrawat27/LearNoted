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
  // Rangy serialized data for precise highlight restoration
  serialized: {
    type: String,
    default: '',
  },
  // Added field for storing surrounding text
  context: {
    type: String,
    default: '',
  },
  // Added field for character position data
  charOffsets: {
    type: Object,
    default: null,
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

import mongoose from 'mongoose';

// Define a schema for individual highlights within a URL
const HighlightItemSchema = new mongoose.Schema({
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

// Main schema for URL-grouped highlights
const URLHighlightSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  highlights: [HighlightItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for efficient queries
URLHighlightSchema.index({ userEmail: 1, url: 1 });

// Pre-save hook to update the updatedAt timestamp whenever the document is modified
URLHighlightSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const URLHighlight =
  mongoose.models.URLHighlight ||
  mongoose.model('URLHighlight', URLHighlightSchema);

export default URLHighlight;

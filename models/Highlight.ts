import mongoose from 'mongoose';

// Define a schema for individual highlights within a domain
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
  url: {
    type: String,
    required: true,
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

// Main schema for domain-grouped highlights
const DomainHighlightSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  domain: {
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
DomainHighlightSchema.index({ userEmail: 1, domain: 1 });

// Pre-save hook to update the updatedAt timestamp whenever the document is modified
DomainHighlightSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const DomainHighlight =
  mongoose.models.DomainHighlight ||
  mongoose.model('DomainHighlight', DomainHighlightSchema);

export default DomainHighlight;

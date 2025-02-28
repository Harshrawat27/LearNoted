const mongoose = require('mongoose');

const YoutubeHighlightSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number, // Stored in seconds
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // References the User collection
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.YoutubeHighlight ||
  mongoose.model('YoutubeHighlight', YoutubeHighlightSchema);

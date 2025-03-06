// import mongoose from 'mongoose';

// const HighlightSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   url: {
//     type: String,
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   color: {
//     type: String,
//     required: true,
//     // You could add enum validation here for your 5 colors
//     // enum: ['red', 'blue', 'green', 'yellow', 'purple'],
//   },
//   serializedRange: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create compound index for efficient queries
// HighlightSchema.index({ user: 1, url: 1 });

// export const Highlight =
//   mongoose.models.Highlight || mongoose.model('Highlight', HighlightSchema);

// import mongoose from 'mongoose';

// const HighlightSchema = new mongoose.Schema({
//   userEmail: {
//     // Changed from userId to userEmail
//     type: String,
//     required: true,
//     index: true,
//   },
//   url: {
//     type: String,
//     required: true,
//     index: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   color: {
//     type: String,
//     required: true,
//     enum: ['yellow', 'green', 'blue', 'pink', 'purple'],
//   },
//   context: {
//     type: String,
//     required: true,
//   },
//   position: {
//     start: Number,
//     end: Number,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.models.Highlight ||
//   mongoose.model('Highlight', HighlightSchema);

import mongoose from 'mongoose';

const HighlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    // You could add enum validation here for your 5 colors
    // enum: ['red', 'blue', 'green', 'yellow', 'purple'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for efficient queries
HighlightSchema.index({ user: 1, url: 1 });

export const Highlight =
  mongoose.models.Highlight || mongoose.model('Highlight', HighlightSchema);

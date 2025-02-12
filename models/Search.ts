// models/Search.ts
import mongoose from 'mongoose';

const SearchSchema = new mongoose.Schema(
  {
    // Reference to the User who made the search
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // The searched word
    word: { type: String, required: true },
    // The definition/meaning returned by the API
    meaning: { type: String, required: true },
    // An array of synonyms (if provided)
    synonyms: { type: [String], default: [] },
    // Optional: a sample sentence or context for the word
    context: { type: String },
    // Optional: any additional information or notes
    additional: { type: String },
  },
  { timestamps: true }
);

// If the model already exists (e.g., during hot-reloads), use it; otherwise, create a new model.
const Search = mongoose.models.Search || mongoose.model('Search', SearchSchema);

export { Search };

// models/Subscriber.js

import mongoose from 'mongoose';

// Define the schema
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  source: {
    type: String,
    default: 'home page form',
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Define and export the model
// Using mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema)
// prevents "OverwriteModelError" when the file is imported multiple times in development
const Subscriber =
  mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;

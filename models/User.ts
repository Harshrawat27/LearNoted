// models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
      default:
        'https://img.freepik.com/free-vector/young-man-glasses-hoodie_1308-174658.jpg',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    wordSearchCount: {
      type: Number,
      default: 0,
    },
    monthlyResetDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add methods to check and manage word searches
UserSchema.methods.canSearchWord = async function () {
  const now = new Date();
  if (this.monthlyResetDate.getMonth() !== now.getMonth()) {
    this.wordSearchCount = 0;
    this.monthlyResetDate = now;
    await this.save(); // Save the reset changes
  }
  return (
    this.subscriptionPlan === 'paid' ||
    (this.subscriptionPlan === 'free' && this.wordSearchCount < 100)
  );
};

UserSchema.methods.incrementWordSearch = function () {
  if (this.subscriptionPlan === 'free') {
    this.wordSearchCount++;
  }
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export { User };

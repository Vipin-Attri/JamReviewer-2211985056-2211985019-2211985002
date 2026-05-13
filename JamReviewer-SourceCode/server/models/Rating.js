const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Ensure one rating per user per song
ratingSchema.index({ userId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);

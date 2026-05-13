const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public_id for deletion
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    singer: { type: String, default: '', trim: true },
    movie: { type: String, default: '', trim: true },
    year: { type: Number, default: null },
    playCount: { type: Number, default: 0 },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
);

// Text index for search
songSchema.index({ title: 'text', singer: 'text', movie: 'text' });

module.exports = mongoose.model('Song', songSchema);

const Rating = require('../models/Rating');
const Song = require('../models/Song');

// @desc    Rate a song (upsert)
// @route   POST /api/ratings/:songId
// @access  Private (USER, CREATOR, ADMIN)
const rateSong = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const song = await Song.findById(req.params.songId);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    const existingRating = await Rating.findOne({
      userId: req.user._id,
      songId: req.params.songId,
    });

    let ratingDoc;
    if (existingRating) {
      existingRating.rating = rating;
      ratingDoc = await existingRating.save();
    } else {
      ratingDoc = await Rating.create({
        userId: req.user._id,
        songId: req.params.songId,
        rating,
      });
    }

    // Calculate new average
    const allRatings = await Rating.find({ songId: req.params.songId });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    res.json({
      success: true,
      rating: ratingDoc,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: allRatings.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rating for a song
// @route   GET /api/ratings/:songId
// @access  Private
const getUserRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      userId: req.user._id,
      songId: req.params.songId,
    });
    res.json({ success: true, rating: rating ? rating.rating : null });
  } catch (error) {
    next(error);
  }
};

module.exports = { rateSong, getUserRating };

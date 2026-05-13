const Song = require('../models/Song');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const cloudinary = require('../config/cloudinary');

// @desc    Upload a new song
// @route   POST /api/songs
// @access  Private (CREATOR)
const uploadSong = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file' });
    }

    const { title, singer, movie, year } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Song title is required' });
    }

    const song = await Song.create({
      title,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      creatorId: req.user._id,
      singer: singer || '',
      movie: movie || '',
      year: year ? parseInt(year) : null,
    });

    res.status(201).json({ success: true, song });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all songs with search & filter
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res, next) => {
  try {
    const { search, singer, movie, year, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { singer: { $regex: search, $options: 'i' } },
        { movie: { $regex: search, $options: 'i' } },
      ];
    }
    if (singer) query.singer = { $regex: singer, $options: 'i' };
    if (movie) query.movie = { $regex: movie, $options: 'i' };
    if (year) query.year = parseInt(year);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Song.countDocuments(query);

    const songs = await Song.find(query)
      .populate('creatorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Attach avg rating to each song
    const songsWithRating = await Promise.all(
      songs.map(async (song) => {
        const ratings = await Rating.find({ songId: song._id });
        const avgRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;
        return { ...song.toObject(), avgRating: parseFloat(avgRating.toFixed(1)), totalRatings: ratings.length };
      })
    );

    res.json({
      success: true,
      songs: songsWithRating,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
const getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id).populate('creatorId', 'name email');
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const ratings = await Rating.find({ songId: song._id });
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    const comments = await Comment.find({ songId: song._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      song: {
        ...song.toObject(),
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalRatings: ratings.length,
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment play count
// @route   POST /api/songs/:id/play
// @access  Public
const playSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, playCount: song.playCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Private (CREATOR owns it, or ADMIN)
const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    // Only creator or admin can delete
    if (song.creatorId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this song' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(song.publicId, { resource_type: 'video' });

    // Delete related comments and ratings
    await Comment.deleteMany({ songId: song._id });
    await Rating.deleteMany({ songId: song._id });

    await song.deleteOne();

    res.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get creator's analytics
// @route   GET /api/songs/analytics
// @access  Private (CREATOR)
const getCreatorAnalytics = async (req, res, next) => {
  try {
    const songs = await Song.find({ creatorId: req.user._id });

    const analytics = await Promise.all(
      songs.map(async (song) => {
        const ratings = await Rating.find({ songId: song._id });
        const comments = await Comment.find({ songId: song._id }).populate('userId', 'name');
        const avgRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

        return {
          _id: song._id,
          title: song.title,
          singer: song.singer,
          movie: song.movie,
          year: song.year,
          playCount: song.playCount,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: ratings.length,
          comments,
          createdAt: song.createdAt,
        };
      })
    );

    const totalPlays = analytics.reduce((sum, s) => sum + s.playCount, 0);
    const overallAvgRating = analytics.length
      ? analytics.reduce((sum, s) => sum + s.avgRating, 0) / analytics.length
      : 0;

    res.json({
      success: true,
      summary: {
        totalSongs: songs.length,
        totalPlays,
        overallAvgRating: parseFloat(overallAvgRating.toFixed(1)),
      },
      songs: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSong, getSongs, getSong, playSong, deleteSong, getCreatorAnalytics };

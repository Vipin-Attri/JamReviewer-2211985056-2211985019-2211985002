const User = require('../models/User');
const Song = require('../models/Song');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (ADMIN)
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCreators, totalSongs, totalComments, totalRatings] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'CREATOR' }),
      Song.countDocuments(),
      Comment.countDocuments(),
      Rating.countDocuments(),
    ]);

    const allSongs = await Song.find().select('playCount');
    const totalPlays = allSongs.reduce((sum, s) => sum + s.playCount, 0);

    res.json({
      success: true,
      stats: { totalUsers, totalCreators, totalSongs, totalComments, totalRatings, totalPlays },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'ADMIN' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Block / unblock a user
// @route   PATCH /api/admin/users/:id/block
// @access  Private (ADMIN)
const toggleBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'ADMIN') return res.status(400).json({ success: false, message: 'Cannot block admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: { _id: user._id, name: user.name, isBlocked: user.isBlocked },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any song (admin)
// @route   DELETE /api/admin/songs/:id
// @access  Private (ADMIN)
const adminDeleteSong = async (req, res, next) => {
  try {
    const cloudinary = require('../config/cloudinary');
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    await cloudinary.uploader.destroy(song.publicId, { resource_type: 'video' });
    await Comment.deleteMany({ songId: song._id });
    await Rating.deleteMany({ songId: song._id });
    await song.deleteOne();

    res.json({ success: true, message: 'Song deleted by admin' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all songs (admin view)
// @route   GET /api/admin/songs
// @access  Private (ADMIN)
const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .populate('creatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, songs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, toggleBlock, adminDeleteSong, getAllSongs };

const Comment = require('../models/Comment');
const Song = require('../models/Song');

// @desc    Add comment to a song
// @route   POST /api/comments/:songId
// @access  Private (USER, CREATOR, ADMIN)
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const song = await Song.findById(req.params.songId);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    const comment = await Comment.create({
      userId: req.user._id,
      songId: req.params.songId,
      text: text.trim(),
    });

    await comment.populate('userId', 'name');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a song
// @route   GET /api/comments/:songId
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ songId: req.params.songId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (owner or ADMIN)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };

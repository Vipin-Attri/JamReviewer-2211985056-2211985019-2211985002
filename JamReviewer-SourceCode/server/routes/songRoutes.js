const express = require('express');
const router = express.Router();
const {
  uploadSong, getSongs, getSong, playSong, deleteSong, getCreatorAnalytics,
} = require('../controllers/songController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getSongs);
router.get('/analytics', protect, authorize('CREATOR'), getCreatorAnalytics);
router.get('/:id', getSong);
router.post('/:id/play', playSong);

// Creator only - upload
router.post('/', protect, authorize('CREATOR'), upload.single('audio'), uploadSong);

// Creator (own) or Admin - delete
router.delete('/:id', protect, authorize('CREATOR', 'ADMIN'), deleteSong);

module.exports = router;

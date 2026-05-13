const express = require('express');
const router = express.Router();
const { rateSong, getUserRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/:songId', protect, rateSong);
router.get('/:songId', protect, getUserRating);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, toggleBlock, adminDeleteSong, getAllSongs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/block', toggleBlock);
router.get('/songs', getAllSongs);
router.delete('/songs/:id', adminDeleteSong);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createConfession,
  getAllConfessions,
  likeConfession,
  dislikeConfession,
  addReply,
  getReplies
} = require('../controllers/confessionController');
const moderationMiddleware = require('../middleware/moderationMiddleware'); // Import AI moderation

// Confession routes
router.post('/', moderationMiddleware, createConfession); // AI moderates before storing
router.get('/', getAllConfessions);
router.post('/:id/like', likeConfession);
router.post('/:id/dislike', dislikeConfession);
router.post('/:id/replies', addReply);
router.get('/:id/replies', getReplies);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createConfession,
  getAllConfessions,
  likeConfession,
  dislikeConfession,
  addReply,
  getReplies,
  getFlaggedConfessions
} = require('../controllers/confessionController');


// Flagged confessions route (specific route first)
router.get('/flagged', getFlaggedConfessions);  

// General confession routes
router.post('/', createConfession);
router.get('/', getAllConfessions);
router.post('/:id/like', likeConfession); // Ensure frontend sends { userId }
router.post('/:id/dislike', dislikeConfession); // Ensure frontend sends { userId }
router.post('/:id/replies', addReply);
router.get('/:id/replies', getReplies);

module.exports = router;
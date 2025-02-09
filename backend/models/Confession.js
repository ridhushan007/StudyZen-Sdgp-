const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxLength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  author: {
    type: String,
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Confession', confessionSchema);
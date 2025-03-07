const mongoose = require('mongoose');
const flaggedConfessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  categories: {
    type: Object,
    default: {}
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('FlaggedConfession', flaggedConfessionSchema);


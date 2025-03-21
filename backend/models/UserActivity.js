const mongoose = require('mongoose');


  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
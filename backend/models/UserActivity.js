const mongoose = require('mongoose');


  activityType: {
    type: String,
    enum: ['journal', 'quiz', 'chat', 'confession'],
    required: true
  },
const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  lectureTitle: { type: String, required: true },
  keyPoints: [String],
  additionalNotes: String,
  questions: [
    {
      description: String,
      isResolved: { type: Boolean, default: false },
      resources: [String],
    },
  ],
  studyMethods: [
    {
      method: String,
      effectiveness: Number,
      notes: String,
    },
  ],
  mood: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
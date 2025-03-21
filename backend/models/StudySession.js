const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  userId: String,
  date: String, // Format: YYYY-MM-DD
  totalStudyTime: Number,
});
module.exports = mongoose.model("StudySession", studySessionSchema); // CommonJS export
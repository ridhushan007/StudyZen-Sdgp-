const express = require("express");
const StudySession = require("../models/StudySession");

const router = express.Router();

// Save study session
router.post("/study-session", async (req, res) => {
  const { userId, studyTime } = req.body;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
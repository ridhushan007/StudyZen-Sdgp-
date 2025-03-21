const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  
  let isConnected = false;

  router.get('/all', async (req, res) => {
    // ✅ Fixed: No '/api/quizzes' prefix
    console.log("✅ Received request at /api/quizzes/week-count"); // Debug log
    try {
      // Get the current week's start and end dates
      
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to start of the week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to end of the week (Saturday)
      endOfWeek.setHours(23, 59, 59, 999);
      console.log("🔍 Querying database for quizzes between:", startOfWeek, "and", endOfWeek); // Debug log

      const quizzesThisWeek = await Quiz.countDocuments({
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
      });
      console.log("📊 Quizzes found:", quizzesThisWeek); 

      res.json({ count: quizzesThisWeek });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving quiz count');
  }
});
router.get('/api/quizzes/all', async (req, res) => {
    try {
      const allQuizzes = await Quiz.find();  // Fetch all quizzes
      res.json(allQuizzes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  module.exports = router;
  
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router(); // <-- Define the router properly

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let isConnected = false;

async function getRecentActivities(req, res) {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
    }

    const db = client.db('test');

    // Fetch recent activities from all collections
    const [journals, quizzes, confessions] = await Promise.all([
      db.collection('journals').find().sort({ timestamp: -1 }).limit(5).toArray(),
      db.collection('quizzes').find().sort({ timestamp: -1 }).limit(5).toArray(),
      db.collection('confessions').find().sort({ timestamp: -1 }).limit(5).toArray(),
    ]);

    // Map activities to include the type and ensure correct timestamp format
    const allActivities = [
      ...journals.map(j => ({ ...j, type: 'journal', timestamp: new Date(j.timestamp) })),
      ...quizzes.map(q => ({ ...q, type: 'quiz', timestamp: new Date(q.timestamp) })),
      ...confessions.map(c => ({ ...c, type: 'confession', timestamp: new Date(c.timestamp) })),
    ];

    // Sort all activities by timestamp in descending order (most recent first)
    const sortedActivities = allActivities.sort((a, b) => b.timestamp - a.timestamp);

    // Get the top 5 most recent activities
    const topActivities = sortedActivities.slice(0, 5);

    console.log("Final Sorted Activities:", topActivities);

    // Send the final sorted and limited list of activities
    res.status(200).json(topActivities);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.get('/', getRecentActivities);

module.exports = router; // Make sure this is defined

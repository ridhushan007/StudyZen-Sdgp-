const express = require('express');
const { MongoClient } = require('mongodb');

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

      const allActivities = [
        ...journals.map(j => ({ ...j, type: 'journal', timestamp: new Date(j.timestamp) })),
        ...quizzes.map(q => ({ ...q, type: 'quiz', timestamp: new Date(q.timestamp) })),
        ...confessions.map(c => ({ ...c, type: 'confession', timestamp: new Date(c.timestamp) })),
      ];
  
  
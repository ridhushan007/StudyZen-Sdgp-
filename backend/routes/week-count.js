const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  
  let isConnected = false;
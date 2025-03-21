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
  
  
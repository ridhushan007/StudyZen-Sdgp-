const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

router.get('/:userId', streakController.getCurrentStreak);
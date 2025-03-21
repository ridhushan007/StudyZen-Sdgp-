const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/recent/:userId', activityController.getRecentActivities);
router.post('/add', activityController.addActivity);
router.get('/last-active/:userId', activityController.getLastActiveTime);
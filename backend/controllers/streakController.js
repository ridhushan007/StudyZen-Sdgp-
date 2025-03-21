const UserActivity = require('../models/UserActivity');
const { subDays, startOfDay, endOfDay } = require('date-fns');

exports.getCurrentStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    let currentStreak = 0;
    let currentDate = new Date();
    let streakBroken = false;
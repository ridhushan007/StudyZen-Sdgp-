const UserActivity = require('../models/UserActivity');
const { subDays, startOfDay, endOfDay } = require('date-fns');

exports.getCurrentStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    let currentStreak = 0;
    let currentDate = new Date();
    let streakBroken = false;

    while (!streakBroken) {
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
  
        const hasActivity = await UserActivity.findOne({
          userId,
          timestamp: {
            $gte: dayStart,
            $lte: dayEnd
          }
        });

        if (hasActivity) {
            currentStreak++;
            currentDate = subDays(currentDate, 1);
          } else {
            streakBroken = true;
          }
        }
        res.json({ streak: currentStreak });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
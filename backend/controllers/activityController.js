const UserActivity = require('../models/UserActivity');



exports.addActivity = async (req, res) => {
  try {
    const { userId, activityType, description } = req.body;
    const activity = new UserActivity({
      userId,
      activityType,
      description
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getLastActiveTime = async (req, res) => {
    try {
      const { userId } = req.params;
      const lastActivity = await UserActivity.findOne({ userId })
        .sort({ timestamp: -1 });
      res.json({ lastActiveTime: lastActivity ? lastActivity.timestamp : null });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
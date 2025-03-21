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
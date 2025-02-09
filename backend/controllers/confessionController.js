const Confession = require('../models/Confession');
const Reply = require('../models/Reply');

// Create a new confession
const createConfession = async (req, res) => {
  try {
    const { text, isAnonymous, author } = req.body;
    const confession = new Confession({
      text,
      isAnonymous,
      author: isAnonymous ? null : author
    });
    
    const savedConfession = await confession.save();
    res.status(201).json(savedConfession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all confessions
const getAllConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ timestamp: -1 }); // Sort by newest first
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a confession
const likeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }
    
    confession.likes += 1;
    const updatedConfession = await confession.save();
    res.json(updatedConfession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Dislike a confession
const dislikeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }
    
    confession.dislikes += 1;
    const updatedConfession = await confession.save();
    res.json(updatedConfession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a reply to a confession
const addReply = async (req, res) => {
  try {
    const { text, isAnonymous, author } = req.body;
    const reply = new Reply({
      confessionId: req.params.id,
      text,
      isAnonymous,
      author: isAnonymous ? null : author
    });
    
    const savedReply = await reply.save();
    res.status(201).json(savedReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get replies for a confession
const getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ confessionId: req.params.id })
      .sort({ timestamp: -1 }); // Sort by newest first
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConfession,
  getAllConfessions,
  likeConfession,
  dislikeConfession,
  addReply,
  getReplies
};
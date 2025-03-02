const JournalEntry = require('../models/JournalEntry.js');

exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

exports.createJournalEntry = async (req, res) => {
  try {
    const entryData = req.body;
    if (!entryData.lectureTitle) {
      return res.status(400).json({ error: 'Lecture title is required' });
    }
    const newEntry = new JournalEntry(entryData);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
};
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

router.get('/', journalController.getJournalEntries);
router.post('/', journalController.createJournalEntry);

module.exports = router;
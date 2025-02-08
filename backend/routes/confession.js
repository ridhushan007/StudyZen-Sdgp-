const express = require('express');
const router = express.Router();

// Temporary storage (will be replaced with database later)
let confessions = [];
let confessionId = 1;

// Get all confessions
router.get('/', (req, res) => {
    res.json(confessions);
});

// Create a new confession
router.post('/', (req, res) => {
    const { text, isAnonymous, author } = req.body;
    
    const newConfession = {
        id: confessionId++,
        text,
        likes: 0,
        dislikes: 0,
        time: new Date().toISOString(),
        isAnonymous,
        author: isAnonymous ? null : author,
        replies: []
    };
    
    confessions.unshift(newConfession);
    res.status(201).json(newConfession);
});

// Add like to a confession
router.post('/:id/like', (req, res) => {
    const confession = confessions.find(c => c.id === parseInt(req.params.id));
    if (!confession) {
        return res.status(404).json({ message: 'Confession not found' });
    }
    
    confession.likes += 1;
    res.json(confession);
});

// Add dislike to a confession
router.post('/:id/dislike', (req, res) => {
    const confession = confessions.find(c => c.id === parseInt(req.params.id));
    if (!confession) {
        return res.status(404).json({ message: 'Confession not found' });
    }
    
    confession.dislikes += 1;
    res.json(confession);
});

// Add reply to a confession
router.post('/:id/replies', (req, res) => {
    const confession = confessions.find(c => c.id === parseInt(req.params.id));
    if (!confession) {
        return res.status(404).json({ message: 'Confession not found' });
    }
    
    const { text, isAnonymous, author } = req.body;
    const newReply = {
        id: confession.replies.length + 1,
        text,
        author: isAnonymous ? null : author,
        isAnonymous,
        time: new Date().toISOString()
    };
    
    confession.replies.push(newReply);
    res.status(201).json(newReply);
});

module.exports = router;
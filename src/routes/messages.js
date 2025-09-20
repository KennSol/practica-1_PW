const express = require('express');
const router = express.Router();
const { createMessage, getLatestMessages, getUserMessages, getFollowedMessages, searchMessages } = require('../models/message');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const message = await createMessage(req.user.id, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const messages = await getLatestMessages(limit);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });
  try {
    const messages = await searchMessages(query);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const messages = await getUserMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const messages = await getFollowedMessages(req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
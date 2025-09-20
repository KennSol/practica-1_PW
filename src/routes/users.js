const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { createUser, getUserByEmail, getUserById, deleteUser, followUser, unfollowUser } = require('../models/user');
const authMiddleware = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    const user = await createUser(email, password);
    res.status(201).json({ id: user.id, email: user.email, created_at: user.created_at });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    res.json({ access_token: token, token_type: 'bearer' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const follow = await followUser(req.user.id, parseInt(req.params.id));
    if (!follow) return res.status(400).json({ error: 'Cannot follow yourself or already following' });
    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const follow = await unfollowUser(req.user.id, parseInt(req.params.id));
    if (!follow) return res.status(404).json({ error: 'Not following this user' });
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
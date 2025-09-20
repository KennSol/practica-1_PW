const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

async function followUser(followerId, followedId) {
  if (followerId === followedId) return null;
  const result = await pool.query(
    'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [followerId, followedId]
  );
  return result.rows[0];
}

async function unfollowUser(followerId, followedId) {
  const result = await pool.query(
    'DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2 RETURNING *',
    [followerId, followedId]
  );
  return result.rows[0];
}

module.exports = { createUser, getUserByEmail, getUserById, deleteUser, followUser, unfollowUser };
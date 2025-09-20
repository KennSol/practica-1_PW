const pool = require('../config/db');

async function createMessage(userId, content) {
  const result = await pool.query(
    'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *',
    [userId, content]
  );
  return result.rows[0];
}

async function getLatestMessages(limit = 10) {
  const result = await pool.query(
    'SELECT * FROM messages ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

async function getUserMessages(userId) {
  const result = await pool.query(
    'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function getFollowedMessages(userId) {
  const result = await pool.query(
    'SELECT m.* FROM messages m JOIN follows f ON m.user_id = f.followed_id WHERE f.follower_id = $1 ORDER BY m.created_at DESC',
    [userId]
  );
  return result.rows;
}

async function searchMessages(query) {
  const result = await pool.query(
    "SELECT * FROM messages WHERE content ILIKE $1 ORDER BY created_at DESC",
    [`%${query}%`]
  );
  return result.rows;
}

module.exports = { createMessage, getLatestMessages, getUserMessages, getFollowedMessages, searchMessages };
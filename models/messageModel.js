const pool = require('../config/db');

async function saveMessage({ name, email, message, userId = null }) {
  await pool.query(
    `INSERT INTO messages (name, email, body, user_id)
     VALUES (?, ?, ?, ?)`,
    [name, email, message, userId]
  );
}

async function listMessages() {
  const [rows] = await pool.query(
    `SELECT m.id, m.name, m.email, m.body, m.created_at, u.username
     FROM messages m
     LEFT JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at DESC`
  );
  return rows;
}

module.exports = {
  saveMessage,
  listMessages,
};

const pool = require('../config/db');
const { hashPassword } = require('../middleware/auth');

const normalizeRole = (role = '') => {
  if (role === 'admin') return 'admin';
  return 'registered';
};

async function findByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [
    username,
  ]);
  return rows[0] || null;
}

async function createUser(username, password, role = 'registered') {
  const normalizedRole = normalizeRole(role);
  const passwordHash = hashPassword(password);
  await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    [username, passwordHash, normalizedRole]
  );
}

async function verifyUser(username, password) {
  const user = await findByUsername(username);
  if (!user) return null;
  const passwordHash = hashPassword(password);
  if (user.password_hash !== passwordHash) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

async function ensureAdminUser({
  username = 'admin',
  password = 'admin123',
} = {}) {
  const existing = await findByUsername(username);
  if (existing) return existing;
  await createUser(username, password, 'admin');
  return findByUsername(username);
}

module.exports = {
  findByUsername,
  createUser,
  verifyUser,
  ensureAdminUser,
};

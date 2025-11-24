const pool = require('../config/db');

async function listSubjects() {
  const [rows] = await pool.query(
    'SELECT id, name, oral_max, written_max FROM vizsgatargy ORDER BY name'
  );
  return rows;
}

async function findSubject(id) {
  const [rows] = await pool.query(
    'SELECT id, name, oral_max, written_max FROM vizsgatargy WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createSubject({ name, oral_max, written_max }) {
  await pool.query(
    'INSERT INTO vizsgatargy (name, oral_max, written_max) VALUES (?, ?, ?)',
    [name, oral_max, written_max]
  );
}

async function updateSubject(id, { name, oral_max, written_max }) {
  await pool.query(
    'UPDATE vizsgatargy SET name = ?, oral_max = ?, written_max = ? WHERE id = ?',
    [name, oral_max, written_max, id]
  );
}

async function deleteSubject(id) {
  await pool.query('DELETE FROM vizsgatargy WHERE id = ?', [id]);
}

module.exports = {
  listSubjects,
  findSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};

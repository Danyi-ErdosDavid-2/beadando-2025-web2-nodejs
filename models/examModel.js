const pool = require('../config/db');

async function getExamRows({ limit = 50, subjectId = null } = {}) {
  const params = [];
  let sql = `
    SELECT v.id,
           vz.name AS student_name,
           vz.class_name as class_name,
           t.name AS subject_name,
           t.oral_max,
           t.written_max,
           v.oral_score,
           v.written_score,
           (v.oral_score + v.written_score) AS total_score
    FROM vizsga v
      JOIN vizsgazo vz ON vz.id = v.vizsgazo_id
      JOIN vizsgatargy t ON t.id = v.vizsgatargy_id`;
  if (subjectId) {
    sql += ' WHERE v.vizsgatargy_id = ?';
    params.push(subjectId);
  }
  sql += ' ORDER BY total_score DESC';
  if (limit) {
    sql += ' LIMIT ?';
    params.push(limit);
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function topSubjects(limit = 4) {
  const [rows] = await pool.query(
    `SELECT t.id, t.name, t.oral_max, t.written_max,
            AVG(v.oral_score + v.written_score) AS avg_total
     FROM vizsga v
     JOIN vizsgatargy t ON t.id = v.vizsgatargy_id
     GROUP BY t.id, t.name, t.oral_max, t.written_max
     ORDER BY avg_total DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

async function topStudents(limit = 5) {
  const [rows] = await pool.query(
    `SELECT vz.id, vz.name, vz.class_name as class_name,
            AVG(v.oral_score + v.written_score) AS avg_total
     FROM vizsga v
     JOIN vizsgazo vz ON vz.id = v.vizsgazo_id
     GROUP BY vz.id, vz.name, vz.class_name
     HAVING COUNT(*) > 1
     ORDER BY avg_total DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

async function getSubjects() {
  const [rows] = await pool.query(
    'SELECT id, name, oral_max, written_max FROM vizsgatargy ORDER BY name'
  );
  return rows;
}

module.exports = {
  getExamRows,
  topStudents,
  topSubjects,
  getSubjects,
};

/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { hashPassword } = require('../middleware/auth');

const dbName = process.env.DB_NAME || process.env.DB_USER || 'db117';
const connectionConfig = {
  host: process.env.DB_HOST || '143.47.98.96',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  multipleStatements: true,
};

const readTsv = (fileName) => {
  const fullPath = path.join(__dirname, '..', 'data', fileName);
  const content = fs.readFileSync(fullPath, 'utf-8').trim();
  const lines = content.split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split('\t');
    rows.push(cols);
  }
  return rows;
};

async function main() {
  const connection = await mysql.createConnection(connectionConfig);
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     DEFAULT CHARACTER SET utf8
     COLLATE utf8_general_ci`
  );
  await connection.query(`USE \`${dbName}\``);

  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(200) NOT NULL,
      role ENUM('registered','admin') NOT NULL DEFAULT 'registered',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL,
      body TEXT NOT NULL,
      user_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS vizsgazo (
      id INT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      class_name VARCHAR(20) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS vizsgatargy (
      id INT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      oral_max INT NOT NULL,
      written_max INT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS vizsga (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vizsgazo_id INT NOT NULL,
      vizsgatargy_id INT NOT NULL,
      oral_score INT NOT NULL,
      written_score INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vizsgazo_id) REFERENCES vizsgazo(id) ON DELETE CASCADE,
      FOREIGN KEY (vizsgatargy_id) REFERENCES vizsgatargy(id) ON DELETE CASCADE
    );
  `);

  await connection.query('TRUNCATE TABLE vizsga');
  await connection.query('TRUNCATE TABLE vizsgatargy');
  await connection.query('TRUNCATE TABLE vizsgazo');
  await connection.query('TRUNCATE TABLE messages');
  await connection.query('TRUNCATE TABLE users');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  const vizsgazoRows = readTsv('vizsgazo.txt');
  for (const [id, name, cls] of vizsgazoRows) {
    await connection.query(
      'INSERT INTO vizsgazo (id, name, class_name) VALUES (?, ?, ?)',
      [Number(id), name, cls]
    );
  }

  const targyRows = readTsv('vizsgatargy.txt');
  for (const [id, name, oralMax, writtenMax] of targyRows) {
    await connection.query(
      'INSERT INTO vizsgatargy (id, name, oral_max, written_max) VALUES (?, ?, ?, ?)',
      [Number(id), name, Number(oralMax), Number(writtenMax)]
    );
  }

  const vizsgaRows = readTsv('vizsga.txt');
  for (const [studentId, subjectId, oral, written] of vizsgaRows) {
    await connection.query(
      'INSERT INTO vizsga (vizsgazo_id, vizsgatargy_id, oral_score, written_score) VALUES (?, ?, ?, ?)',
      [Number(studentId), Number(subjectId), Number(oral), Number(written)]
    );
  }

  const adminUser = process.env.DEFAULT_ADMIN_USER || 'admin';
  const adminPass = process.env.DEFAULT_ADMIN_PASS || 'admin123';
  await connection.query(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    [adminUser, hashPassword(adminPass), 'admin']
  );

  console.log('Adatbázis feltöltve. Belépés:', adminUser);
  await connection.end();
}

main().catch((err) => {
  console.error('A seed futtatása során hiba történt:', err);
  process.exit(1);
});

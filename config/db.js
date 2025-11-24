const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '143.47.98.96',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || process.env.DB_USER || 'db117',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8',
});

module.exports = pool;

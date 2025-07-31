// models/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // optional: if you want access to the raw pool
};

// models/qrModel.js
const db = require('./db');

async function createQRCode(code) {
  const result = await db.query(
    'INSERT INTO qr_codes (code) VALUES ($1) RETURNING *',
    [code]
  );
  return result.rows[0];
}

module.exports = { createQRCode };

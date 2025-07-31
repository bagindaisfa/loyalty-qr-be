const db = require('./models/db');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Waktu dari DB:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error DB:', err);
    process.exit(1);
  }
}

testConnection();

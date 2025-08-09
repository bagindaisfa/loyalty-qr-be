const db = require('./db');
const { v4: uuidv4 } = require('uuid');

exports.createAdmin = async (email, password, role, tenant_id = null) => {
  const id = uuidv4();
  await db.query(
    `INSERT INTO admins (id, email, password, role, tenant_id) VALUES ($1, $2, $3, $4, $5)`,
    [id, email, password, role, tenant_id]
  );
  return { id, email, role, tenant_id };
};

exports.findByEmail = async (email) => {
  const res = await db.query(`SELECT * FROM admins WHERE email = $1`, [email]);
  return res.rows[0];
};

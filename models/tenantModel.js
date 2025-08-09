const db = require('./db');

exports.getAllTenants = async () => {
  const result = await db.query(`
    SELECT id, name, subscription_tier, created_at
    FROM tenants
    ORDER BY created_at DESC
  `);
  return result.rows;
};

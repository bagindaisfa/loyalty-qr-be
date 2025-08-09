const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

exports.getUsersByTenant = async (tenantId) => {
  const res = await db.query(
    `
    SELECT 
      u.name,
      u.phone,
      ub.balance,
      ub.reward_type,
      ub.updated_at
    FROM user_balances ub
    JOIN users u ON ub.user_id = u.id
    WHERE ub.tenant_id = $1
    ORDER BY ub.updated_at DESC
  `,
    [tenantId]
  );

  return res.rows;
};

exports.getTenantRewardHistory = async (tenantId) => {
  const res = await db.query(
    `
      SELECT
        rl.type,
        rl.amount,
        rl.note,
        rl.created_at,
        u.name AS user_name,
        u.phone AS user_phone
      FROM reward_logs rl
      JOIN users u ON rl.user_id = u.id
      WHERE rl.tenant_id = $1
      ORDER BY rl.created_at DESC
    `,
    [tenantId]
  );

  return res.rows;
};

exports.createTenant = async (name, tier) => {
  await db.query('BEGIN');

  const id = uuidv4();

  // Insert tenant
  await db.query(
    `
    INSERT INTO tenants (id, name, subscription_tier)
    VALUES ($1, $2, $3)
  `,
    [id, name, tier]
  );

  // Generate QR statis
  const qrCode = `QR-${crypto.randomBytes(4).toString('hex')}`;
  const qrId = uuidv4();

  await db.query(
    `
    INSERT INTO qr_codes (id, tenant_id, code, point_value)
    VALUES ($1, $2, $3, 1)
  `,
    [qrId, id, qrCode]
  );

  await db.query('COMMIT');

  return {
    id,
    name,
    tier,
    qr_code: qrCode,
  };
};

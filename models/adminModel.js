const db = require('./db');

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

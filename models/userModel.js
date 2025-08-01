const db = require('./db');

exports.getBalanceByPhone = async (phone) => {
  // Cari user
  const userRes = await db.query(`SELECT * FROM users WHERE phone = $1`, [
    phone,
  ]);
  if (userRes.rows.length === 0) return null;

  const user = userRes.rows[0];

  // Ambil semua saldo per tenant
  const balanceRes = await db.query(
    `
    SELECT 
      ub.balance,
      ub.reward_type,
      ub.updated_at,
      t.name AS tenant_name
    FROM user_balances ub
    JOIN tenants t ON ub.tenant_id = t.id
    WHERE ub.user_id = $1
  `,
    [user.id]
  );

  return {
    name: user.name,
    phone: user.phone,
    balances: balanceRes.rows,
  };
};

exports.getUserHistoryByPhone = async (phone) => {
  // Ambil user
  const userRes = await db.query(`SELECT id FROM users WHERE phone = $1`, [
    phone,
  ]);
  if (userRes.rows.length === 0) return null;

  const userId = userRes.rows[0].id;

  // Ambil histori reward
  const historyRes = await db.query(
    `
      SELECT
        rl.type,
        rl.amount,
        rl.note,
        rl.created_at,
        t.name AS tenant_name
      FROM reward_logs rl
      JOIN tenants t ON rl.tenant_id = t.id
      WHERE rl.user_id = $1
        AND rl.created_at >= NOW() - INTERVAL '30 days'
      ORDER BY rl.created_at DESC
    `,
    [userId]
  );

  return historyRes.rows;
};

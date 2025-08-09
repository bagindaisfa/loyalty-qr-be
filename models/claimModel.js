const db = require('./db');

exports.handleClaim = async (code, name, phone) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Ambil data QR
    const qrRes = await client.query(
      `SELECT * FROM qr_codes WHERE code = $1 AND is_used = false`,
      [code]
    );
    if (qrRes.rowCount === 0) {
      throw { status: 404, message: 'QR tidak valid atau sudah digunakan.' };
    }

    const qr = qrRes.rows[0];

    // 2. Ambil/membuat user
    let userRes = await client.query(`SELECT * FROM users WHERE phone = $1`, [
      phone,
    ]);
    let user;
    if (userRes.rowCount === 0) {
      userRes = await client.query(
        `INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *`,
        [name, phone]
      );
    }
    user = userRes.rows[0];

    const tenantId = qr.tenant_id;
    const userId = user.id;

    // 3. Ambil tenant settings
    const settingRes = await client.query(
      `SELECT * FROM tenant_settings WHERE tenant_id = $1`,
      [tenantId]
    );
    const settings = settingRes.rows[0];
    if (!settings)
      throw { status: 400, message: 'Pengaturan tenant tidak ditemukan.' };

    let rewardAmount = 0;
    let transactionCount = 0;

    if (settings.reward_type === 'coin') {
      rewardAmount = qr.point_value;
    } else if (settings.reward_type === 'point') {
      rewardAmount = settings.point_per_transaction || 1;
      transactionCount = 1;
    }

    // 4. Update QR sebagai sudah digunakan
    await client.query(
      `UPDATE qr_codes SET is_used = true, used_by_user_id = $1, used_at = NOW() WHERE id = $2`,
      [userId, qr.id]
    );

    // 5. Simpan log klaim
    await client.query(
      `INSERT INTO reward_logs (user_id, tenant_id, type, amount, transaction_count, note)
       VALUES ($1, $2, 'claim', $3, $4, $5)`,
      [userId, tenantId, rewardAmount, transactionCount, `Klaim via QR ${code}`]
    );

    // 6. Update/Insert saldo
    await client.query(
      `
      INSERT INTO user_balances (user_id, tenant_id, balance, reward_type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, tenant_id)
      DO UPDATE SET balance = user_balances.balance + EXCLUDED.balance,
                    updated_at = NOW()
    `,
      [userId, tenantId, rewardAmount, settings.reward_type]
    );

    await client.query('COMMIT');

    return { point: rewardAmount, reward_type: settings.reward_type };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

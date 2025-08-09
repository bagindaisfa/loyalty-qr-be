const db = require('./db');

exports.processRedeem = async (phone, tenant_id) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Ambil user
    const userRes = await client.query(`SELECT * FROM users WHERE phone = $1`, [
      phone,
    ]);
    if (userRes.rowCount === 0)
      throw { status: 404, message: 'Pelanggan tidak ditemukan.' };
    const user = userRes.rows[0];

    // Ambil saldo
    const balanceRes = await client.query(
      `SELECT * FROM user_balances WHERE user_id = $1 AND tenant_id = $2`,
      [user.id, tenant_id]
    );
    if (balanceRes.rowCount === 0)
      throw { status: 400, message: 'Saldo tidak ditemukan.' };

    const balance = balanceRes.rows[0];

    // Ambil tenant settings
    const settingRes = await client.query(
      `SELECT * FROM tenant_settings WHERE tenant_id = $1`,
      [tenant_id]
    );
    const settings = settingRes.rows[0];

    let canRedeem = false;
    let redeemAmount = 0;

    if (balance.reward_type === 'coin') {
      const minRedeem = settings.min_redeem_amount || 0;

      if (balance.balance < minRedeem) {
        throw {
          status: 400,
          message: `Minimal ${minRedeem} coin untuk penukaran reward.`,
        };
      }
      canRedeem = true;
      redeemAmount = balance.balance; // atau nanti bisa dibuat input custom nominal
    } else if (balance.reward_type === 'point') {
      if (!settings.reward_threshold) {
        throw {
          status: 400,
          message: 'Pengaturan reward threshold belum diatur.',
        };
      }
      if (balance.balance >= settings.reward_threshold) {
        canRedeem = true;
        redeemAmount = settings.reward_threshold;
      } else {
        throw {
          status: 400,
          message: `Belum mencapai ${settings.reward_threshold} poin untuk penukaran.`,
        };
      }
    }

    if (!canRedeem) {
      throw { status: 400, message: 'Belum memenuhi syarat untuk redeem.' };
    }

    // Simpan log redeem
    await client.query(
      `INSERT INTO reward_logs (user_id, tenant_id, type, amount, note)
       VALUES ($1, $2, 'redeem', $3, $4)`,
      [user.id, tenant_id, redeemAmount, 'Penukaran reward']
    );

    // Kurangi saldo
    await client.query(
      `UPDATE user_balances
       SET balance = balance - $1, updated_at = NOW()
       WHERE id = $2`,
      [redeemAmount, balance.id]
    );

    await client.query('COMMIT');

    return {
      message: 'Reward berhasil ditukar!',
      balance: balance.balance - redeemAmount,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const db = require('./db');

exports.handleClaim = async (code, name, phone) => {
  await db.query('BEGIN');

  // 1. Cek QR code
  const qrRes = await db.query(
    `
    SELECT * FROM qr_codes WHERE code = $1 AND is_used = FALSE
  `,
    [code]
  );

  if (qrRes.rows.length === 0) {
    throw { status: 404, message: 'QR code tidak valid atau sudah digunakan.' };
  }

  const qr = qrRes.rows[0];

  // 2. Cari atau buat user
  let userRes = await db.query(`SELECT * FROM users WHERE phone = $1`, [phone]);
  let user;

  if (userRes.rows.length === 0) {
    const newUserRes = await db.query(
      `
      INSERT INTO users (name, phone)
      VALUES ($1, $2)
      RETURNING *
    `,
      [name, phone]
    );
    user = newUserRes.rows[0];
  } else {
    user = userRes.rows[0];
  }

  // 3. Update atau buat saldo user
  const balanceRes = await db.query(
    `
    SELECT * FROM user_balances
    WHERE user_id = $1 AND tenant_id = $2
  `,
    [user.id, qr.tenant_id]
  );

  if (balanceRes.rows.length === 0) {
    await db.query(
      `
      INSERT INTO user_balances (user_id, tenant_id, balance, reward_type)
      VALUES ($1, $2, $3, 'point')
    `,
      [user.id, qr.tenant_id, qr.point_value]
    );
  } else {
    await db.query(
      `
      UPDATE user_balances
      SET balance = balance + $1, updated_at = NOW()
      WHERE user_id = $2 AND tenant_id = $3
    `,
      [qr.point_value, user.id, qr.tenant_id]
    );
  }

  // 4. Log reward
  await db.query(
    `
    INSERT INTO reward_logs (user_id, tenant_id, type, amount, note)
    VALUES ($1, $2, 'claim', $3, $4)
  `,
    [user.id, qr.tenant_id, qr.point_value, `Klaim QR: ${code}`]
  );

  // 5. Tandai QR sudah digunakan
  await db.query(
    `
    UPDATE qr_codes
    SET is_used = TRUE, used_by_user_id = $1, used_at = NOW()
    WHERE code = $2
  `,
    [user.id, code]
  );

  await db.query('COMMIT');

  return { point: qr.point_value };
};

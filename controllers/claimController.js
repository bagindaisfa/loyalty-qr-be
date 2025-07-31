const db = require('../models/db');

async function claimPoint(req, res) {
  const { code } = req.params;
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'Name and phone are required' });
  }

  try {
    // 1. Cek QR code valid & belum dipakai
    const qrRes = await db.query('SELECT * FROM qr_codes WHERE code = $1', [
      code,
    ]);
    const qr = qrRes.rows[0];

    if (!qr) {
      return res
        .status(404)
        .json({ success: false, message: 'QR code not found' });
    }

    if (qr.is_used) {
      return res
        .status(400)
        .json({ success: false, message: 'QR code already used' });
    }

    // 2. Cari user, kalau belum ada → buat baru
    let userRes = await db.query('SELECT * FROM users WHERE phone = $1', [
      phone,
    ]);
    let user = userRes.rows[0];

    if (!user) {
      const newUserRes = await db.query(
        'INSERT INTO users (name, phone, total_points) VALUES ($1, $2, $3) RETURNING *',
        [name, phone, 1]
      );
      user = newUserRes.rows[0];
    } else {
      // Update poin
      await db.query(
        'UPDATE users SET total_points = total_points + 1 WHERE id = $1',
        [user.id]
      );
    }

    // 3. Tandai QR sudah dipakai
    await db.query(
      'UPDATE qr_codes SET is_used = true, used_by_user_id = $1 WHERE code = $2',
      [user.id, code]
    );

    // 4. Simpan log klaim
    await db.query(
      'INSERT INTO point_logs (user_id, action, amount) VALUES ($1, $2, $3)',
      [user.id, 'claim', 1]
    );

    res
      .status(200)
      .json({ success: true, message: 'Point claimed successfully!' });
  } catch (err) {
    console.error('Claim error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  claimPoint,
};

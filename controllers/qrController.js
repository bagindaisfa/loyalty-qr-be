const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

async function generateQR(req, res) {
  const { quantity = 1 } = req.body;

  try {
    const createdQRCodes = [];

    for (let i = 0; i < quantity; i++) {
      const token = uuidv4(); // bisa diganti dengan pendek (misal: nanoid atau 8 digit custom)
      const insert = await db.query(
        'INSERT INTO qr_codes (code) VALUES ($1) RETURNING *',
        [token]
      );

      const qrImage = await QRCode.toDataURL(
        `https://kedaiku.app/claim/${token}`
      );
      createdQRCodes.push({
        code: insert.rows[0].code,
        qr_image: qrImage,
      });
    }

    res.status(201).json({ success: true, data: createdQRCodes });
  } catch (err) {
    console.error('QR Generate Error:', err);
    res.status(500).json({ success: false, message: 'QR generation failed' });
  }
}

module.exports = {
  generateQR,
};

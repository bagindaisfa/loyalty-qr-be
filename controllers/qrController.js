const qrModel = require('../models/qrModel');

exports.generateQR = async (req, res) => {
  const { tenant_id, amount } = req.body;

  if (!tenant_id) {
    return res.status(400).json({ message: 'tenant_id wajib diisi.' });
  }

  try {
    const count = await qrModel.generateQRCodes(tenant_id, amount || 1);
    res.json({ message: `${count} QR code berhasil dibuat.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat QR code.' });
  }
};

exports.generateStaticQR = async (req, res) => {
  const { tenant_id } = req.body;

  if (!tenant_id) {
    return res.status(400).json({ message: 'tenant_id wajib diisi.' });
  }

  try {
    const qr = await qrModel.generateStaticQR(tenant_id);
    res.json({ message: 'QR statis berhasil diproses.', qr_code: qr.code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat QR statis.' });
  }
};

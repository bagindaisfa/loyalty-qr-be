const claimModel = require('../models/claimModel');

exports.claimReward = async (req, res) => {
  const { code } = req.params;
  const { name, phone } = req.body;

  // Validasi input
  if (!name || !phone) {
    return res.status(400).json({ message: 'Nama dan nomor HP wajib diisi.' });
  }

  if (!/^[0-9]{9,15}$/.test(phone)) {
    return res.status(400).json({ message: 'Nomor HP tidak valid.' });
  }

  try {
    const result = await claimModel.handleClaim(code, name, phone);
    res.json({
      message: 'Reward berhasil diklaim!',
      point: result.point,
      type: result.reward_type,
    });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Terjadi kesalahan saat klaim QR.' });
  }
};

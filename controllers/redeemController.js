const redeemModel = require('../models/redeemModel');

exports.redeemReward = async (req, res) => {
  const { phone, tenant_id } = req.body;

  if (!phone || !tenant_id) {
    return res
      .status(400)
      .json({ message: 'Nomor HP dan tenant wajib diisi.' });
  }

  try {
    const result = await redeemModel.processRedeem(phone, tenant_id);
    res.json({ message: result.message, balance: result.balance });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Gagal menukarkan reward.' });
  }
};

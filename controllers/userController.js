const userModel = require('../models/userModel');

exports.getUserBalance = async (req, res) => {
  const { phone } = req.params;

  try {
    const result = await userModel.getBalanceByPhone(phone);

    if (!result || result.balances.length === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan atau belum memiliki poin.',
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data saldo pengguna.' });
  }
};

exports.getUserHistory = async (req, res) => {
  const { phone } = req.params;

  try {
    const result = await userModel.getUserHistoryByPhone(phone);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({
          message:
            'Histori tidak ditemukan atau pengguna belum pernah klaim/redeem.',
        });
    }

    res.json({ history: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil histori pengguna.' });
  }
};

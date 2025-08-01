const adminModel = require('../models/adminModel');

exports.getTenantUsers = async (req, res) => {
  const { tenant_id } = req.params;

  try {
    const users = await adminModel.getUsersByTenant(tenant_id);

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data pelanggan tenant.' });
  }
};

exports.getTenantHistory = async (req, res) => {
  const { tenant_id } = req.params;

  try {
    const history = await adminModel.getTenantRewardHistory(tenant_id);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil histori tenant.' });
  }
};

const adminModel = require('../models/adminModel');

exports.getTenantUsers = async (req, res) => {
  const tenant_id = req.user.tenant_id;
  try {
    const users = await adminModel.getUsersByTenant(tenant_id);

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data pelanggan tenant.' });
  }
};

exports.getTenantHistory = async (req, res) => {
  const tenant_id = req.user.tenant_id;

  try {
    const history = await adminModel.getTenantRewardHistory(tenant_id);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil histori tenant.' });
  }
};

exports.createTenant = async (req, res) => {
  const { name, tier } = req.body;

  if (!name || !tier) {
    return res.status(400).json({ message: 'Nama dan tier wajib diisi.' });
  }

  try {
    const tenant = await adminModel.createTenant(name, tier);
    res.status(201).json({ message: 'Tenant berhasil dibuat.', tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat tenant.' });
  }
};

exports.getTenantUsersById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const users = await adminModel.getUsersByTenant(tenantId);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data pelanggan.' });
  }
};

exports.getTenantHistoryById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const history = await adminModel.getTenantRewardHistory(tenantId);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil histori transaksi.' });
  }
};

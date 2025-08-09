const tenantSettingModel = require('../models/tenantSettingModel');

exports.getSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const settings = await tenantSettingModel.getSettingsByTenant(tenantId);
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pengaturan.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const updated = await tenantSettingModel.updateSettingsByTenant(
      tenantId,
      req.body
    );
    res.json({ message: 'Pengaturan berhasil diperbarui.', settings: updated });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui pengaturan.' });
  }
};

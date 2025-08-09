const tenantModel = require('../models/tenantModel');

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await tenantModel.getAllTenants();
    res.json({ tenants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil daftar tenant.' });
  }
};

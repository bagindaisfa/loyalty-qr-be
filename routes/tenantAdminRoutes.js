const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const tenantSettingController = require('../controllers/tenantSettingController');

// Proteksi: hanya tenant admin
router.use(requireAuth);
router.use(requireRole('tenant'));

// Ambil pelanggan hanya untuk tenant yang login
router.get('/users', adminController.getTenantUsersById);
router.get('/history', adminController.getTenantHistoryById);
router.get('/settings', tenantSettingController.getSettings);
router.put('/settings', tenantSettingController.updateSettings);

module.exports = router;

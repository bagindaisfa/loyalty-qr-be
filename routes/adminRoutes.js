const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('internal'));

router.get('/tenant/users', adminController.getTenantUsers);
router.get('/tenant/history', adminController.getTenantHistory);
router.post('/tenant', adminController.createTenant);

module.exports = router;

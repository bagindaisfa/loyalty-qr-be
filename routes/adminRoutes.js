const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/tenant/:tenant_id/users', adminController.getTenantUsers);
router.get('/tenant/:tenant_id/history', adminController.getTenantHistory);

module.exports = router;

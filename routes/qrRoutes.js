const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('internal'));

router.post('/generate', qrController.generateQR);
router.post('/static', qrController.generateStaticQR);

module.exports = router;

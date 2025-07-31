const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qrController');

// POST /api/qr/generate
router.post('/generate', generateQR);

module.exports = router;

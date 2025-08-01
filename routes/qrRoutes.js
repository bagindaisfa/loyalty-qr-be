const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

router.post('/generate', qrController.generateQR);
router.post('/static', qrController.generateStaticQR);

module.exports = router;

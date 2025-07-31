const express = require('express');
const router = express.Router();
const { claimPoint } = require('../controllers/claimController');

// POST /api/claim/:code
router.post('/:code', claimPoint);

module.exports = router;

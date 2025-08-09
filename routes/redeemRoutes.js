const express = require('express');
const router = express.Router();
const redeemController = require('../controllers/redeemController');

router.post('/', redeemController.redeemReward);

module.exports = router;

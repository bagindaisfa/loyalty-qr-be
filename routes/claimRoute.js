const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.post('/:code', claimController.claimReward);

module.exports = router;

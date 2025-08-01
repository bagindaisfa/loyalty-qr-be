const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/balance/:phone', userController.getUserBalance);
router.get('/history/:phone', userController.getUserHistory);

module.exports = router;

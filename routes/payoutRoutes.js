const express = require('express');
const payoutController = require('../controllers/payoutController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authMiddleware.authenticate);

// Confirm payout
router.post('/confirm', payoutController.confirmPayout);

module.exports = router;
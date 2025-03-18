const express = require('express');
const contestController = require('../controllers/contestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authMiddleware.authenticate);

// Create a new contest
router.post('/create', contestController.createContest);

// Update contest status (accept/decline)
router.put('/update-status', contestController.updateContestStatus);
router.post('/acceptContest', contestController.acceptContest);

module.exports = router;
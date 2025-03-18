const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { getuser, searchUser } = require('../controllers/userController');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authMiddleware.authenticate);

// Create a new contest
router.get('/users', getuser);

// Update contest status (accept/decline)
router.get('/user/search', searchUser);

module.exports = router;
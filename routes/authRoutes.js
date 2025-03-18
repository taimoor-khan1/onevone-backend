const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Verify email
router.post('/verify-email', authController.verifyEmail);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Update password
router.post('/update-password', authController.updatePassword);

// Upload profile picture
router.post('/upload-profile-picture', authController.uploadProfilePicture);

module.exports = router;
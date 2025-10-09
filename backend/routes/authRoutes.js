const express = require('express');
const router = express.Router();
const {
	signup,
	signin,
	forgotPassword,
	resetPassword,
	changePassword,
	logout,
	verifyEmail,
	resendVerification,
} = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/signin', signin);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;

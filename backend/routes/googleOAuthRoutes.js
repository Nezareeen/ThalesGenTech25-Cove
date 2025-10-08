const express = require('express');
const router = express.Router();
const { googleOAuth, logout } = require('../controllers/googleOAuthControllers');

router.post('/google', googleOAuth);
router.post('/google/logout', logout);

module.exports = router;

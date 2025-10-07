const express = require('express');
const router = express.Router();
const { googleOAuth } = require('../controllers/googleOAuthControllers');

router.post('/google', googleOAuth);

module.exports = router;

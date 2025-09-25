// backend/routes/chatbotRoutes.js

const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// POST request to handle a new chat message
router.post('/chat', chatbotController.handleChatMessage);

module.exports = router;
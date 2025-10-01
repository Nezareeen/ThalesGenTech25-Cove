// backend/models/Conversation.js

const mongoose = require('mongoose');

// Define the schema for an individual message
const messageSchema = new mongoose.Schema({
    sender: {
        type: String, // 'user' or 'bot'
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Define the main Conversation schema
const conversationSchema = new mongoose.Schema({
    // In a full application, this would be a reference to a User ID
    userId: {
        type: String, 
        required: true,
        default: 'default_user_session', // Use a default for now
        unique: true, // Only one active conversation per user ID
    },
    messages: [messageSchema], // Array of messages
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
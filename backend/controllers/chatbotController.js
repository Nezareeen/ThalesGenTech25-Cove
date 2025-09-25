// backend/controllers/chatbotController.js

const { getAIResponse } = require('../services/geminiService');
// Import other services as you build them (e.g., const { getWeather } = require('../services/weatherService');)

/**
 * Handles incoming chat messages from the frontend.
 * For now, it just passes the message to the Gemini API.
 * Later, it will check the message for intent (weather, location, general).
 */
async function handleChatMessage(req, res) {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        // Step 1: **DETERMINE INTENT** (Future Step)
        // Check if the message is asking for weather or location.
        // For now, we treat every message as a general chat prompt.
        
        // Step 2: **GET AI RESPONSE**
        // You can add a system instruction to the prompt to make the AI act like 'Cove'.
        const systemInstruction = "You are Cove, a helpful, friendly, and brief AI-powered guide for weather and exploration. Respond only to the user's message.";
        const fullPrompt = `${systemInstruction}\n\nUser: ${userMessage}`;
        
        const aiResponse = await getAIResponse(fullPrompt);

        // Step 3: **SAVE TO DB** (Future Step)
        // Save the userMessage and aiResponse to MongoDB.

        // Step 4: **SEND RESPONSE**
        res.json({ 
            response: aiResponse,
            // Later, you can send back structured data like weather data too
        });

    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({ error: 'Failed to process chat message.' });
    }
}

module.exports = {
    handleChatMessage,
};
// backend/services/geminiService.js

const { GoogleGenAI } = require('@google/genai');

let aiClient = null; // Client is initialized to null

/**
 * Ensures the GoogleGenAI client is initialized once and returns it.
 * This function waits until it's called (i.e., when a chat request hits the endpoint),
 * guaranteeing that process.env.GEMINI_API_KEY is available.
 */
function getAIClient() {
    if (!aiClient) {
        // CRITICAL CHECK: Ensure the key is present before initialization
        if (!process.env.GEMINI_API_KEY) {
            console.error("FATAL: GEMINI_API_KEY is missing! Check your .env file and dotenv setup.");
            throw new Error("AI service is not configured.");
        }
        
        // Initialize the client only now
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("Gemini AI Client initialized successfully.");
    }
    return aiClient;
}

// The model to use for the chatbot
const MODEL_NAME = "gemini-2.5-flash"; 

/**
 * Generates an AI response using the Gemini API.
 * @param {string} prompt - The user's message or a system prompt combining the user message and weather/location data.
 * @returns {Promise<string>} The AI's text response.
 */
async function getAIResponse(prompt) {
    if (!prompt) {
        return "I need a message to respond to!";
    }

    try {
        // Use the getter function to access the client
        const ai = getAIClient(); 
        
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        // The response contains the generated text
        return response.text;
    } catch (error) {
        // We log the specific error message here for better debugging
        console.error("Error calling Gemini API:", error.message);
        return "I apologize, but I'm having trouble connecting right now.";
    }
}

// NOTE: For the full "Interactive AI Chatbot" feature, you will need to
// use the `ai.chats` service to maintain conversation history (context).

module.exports = {
    getAIResponse,
};
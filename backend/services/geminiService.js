// // backend/services/geminiService.js

// const { GoogleGenAI } = require('@google/genai');

// let aiClient = null; // Client is initialized to null

// /**
//  * Ensures the GoogleGenAI client is initialized once and returns it.
//  * This function waits until it's called (i.e., when a chat request hits the endpoint),
//  * guaranteeing that process.env.GEMINI_API_KEY is available.
//  */
// function getAIClient() {
//     if (!aiClient) {
//         // CRITICAL CHECK: Ensure the key is present before initialization
//         if (!process.env.GEMINI_API_KEY) {
//             console.error("FATAL: GEMINI_API_KEY is missing! Check your .env file and dotenv setup.");
//             throw new Error("AI service is not configured.");
//         }
        
//         // Initialize the client only now
//         aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//         console.log("Gemini AI Client initialized successfully.");
//     }
//     return aiClient;
// }

// // The model to use for the chatbot
// const MODEL_NAME = "gemini-2.5-flash"; 

// /**
//  * Generates an AI response using the Gemini API.
//  * @param {string} prompt - The user's message or a system prompt combining the user message and weather/location data.
//  * @returns {Promise<string>} The AI's text response.
//  */
// async function getAIResponse(prompt) {
//     if (!prompt) {
//         return "I need a message to respond to!";
//     }

//     try {
//         // Use the getter function to access the client
//         const ai = getAIClient(); 
        
//         const response = await ai.models.generateContent({
//             model: MODEL_NAME,
//             contents: prompt,
//         });

//         // The response contains the generated text
//         return response.text;
//     } catch (error) {
//         // We log the specific error message here for better debugging
//         console.error("Error calling Gemini API:", error.message);
//         return "I apologize, but I'm having trouble connecting right now.";
//     }
// }

// // NOTE: For the full "Interactive AI Chatbot" feature, you will need to
// // use the `ai.chats` service to maintain conversation history (context).

// module.exports = {
//     getAIResponse,
// };


// // backend/services/geminiService.js (Updated with Google Search Tool)

// const { GoogleGenAI } = require('@google/genai');

// let aiClient = null; // Client is initialized to null

// /**
//  * Ensures the GoogleGenAI client is initialized once and returns it.
//  * This function waits until it's called (i.e., when a chat request hits the endpoint),
//  * guaranteeing that process.env.GEMINI_API_KEY is available.
//  */
// function getAIClient() {
//     if (!aiClient) {
//         // CRITICAL CHECK: Ensure the key is present before initialization
//         if (!process.env.GEMINI_API_KEY) {
//             console.error("FATAL: GEMINI_API_KEY is missing! Check your .env file and dotenv setup.");
//             throw new Error("AI service is not configured.");
//         }
        
//         // Initialize the client only now
//         aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//         console.log("Gemini AI Client initialized successfully.");
//     }
//     return aiClient;
// }

// // The model to use for the chatbot
// const MODEL_NAME = "gemini-2.5-flash"; 

// /**
//  * Generates an AI response using the Gemini API, now with Google Search grounding.
//  * @param {string} prompt - The user's message.
//  * @returns {Promise<string>} The AI's text response.
//  */
// async function getAIResponse(prompt) {
//     if (!prompt) {
//         return "I need a message to respond to!";
//     }

//     try {
//         // Use the getter function to access the client
//         const ai = getAIClient(); 
        
//         // Define the instruction to make the AI act as Cove, with Search capability
//         const systemInstruction = "You are Cove, a helpful, friendly, and brief AI-powered guide for weather and exploration. You can use Google Search to provide current and accurate information when needed.";

//         const response = await ai.models.generateContent({
//             model: MODEL_NAME,
//             // The prompt needs to be structured correctly as content parts
//             contents: [{ role: "user", parts: [{ text: prompt }] }],
//             config: {
//                 // 💥 CRITICAL CHANGE: Enable the Google Search tool here
//                 tools: [{ googleSearch: {} }],
//                 systemInstruction: systemInstruction,
//             },
//         });

//         // The response contains the generated text
//         return response.text;
//     } catch (error) {
//         // We log the specific error message here for better debugging
//         console.error("Error calling Gemini API:", error.message);
//         return "I apologize, but I'm having trouble connecting right now.";
//     }
// }

// // NOTE: For the full "Interactive AI Chatbot" feature, you will need to
// // use the `ai.chats` service to maintain conversation history (context).

// module.exports = {
//     getAIResponse,
// };


// backend/services/geminiService.js (Updated for Chat Context and History)

const { GoogleGenAI } = require('@google/genai');

let aiClient = null; // Client is initialized to null

/**
 * Ensures the GoogleGenAI client is initialized once and returns it.
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
 * Generates an AI response using the Gemini Chat service, maintaining conversation history.
 * * @param {string} prompt - The new user's message (which may include prepended tool instructions).
 * @param {Array<Object>} history - Previous messages for context in Gemini's format.
 * @returns {Promise<string>} The AI's text response.
 */
async function getAIResponseWithHistory(prompt, history) {
    if (!prompt) {
        return "I need a message to respond to!";
    }

    try {
        const ai = getAIClient(); 
        
        // Define the instruction to make the AI act as Cove, with Search capability
        const systemInstruction = "You are Cove, a helpful, friendly, and brief AI-powered guide for weather and exploration. You can use Google Search to provide current and accurate information when needed.";

        // 💥 KEY CHANGE 1: Use ai.chats.create to initialize a chat session
        const chat = ai.chats.create({
            model: MODEL_NAME,
            config: {
                // Enable Google Search
                tools: [{ googleSearch: {} }],
                systemInstruction: systemInstruction,
            },
            // 💥 KEY CHANGE 2: Pass the loaded history array to initialize the chat context
            history: history || [], 
        });

        // 💥 KEY CHANGE 3: Use chat.sendMessage for the new prompt
        const response = await chat.sendMessage({ message: prompt });

        // The response contains the generated text
        return response.text;
    } catch (error) {
        // We log the specific error message here for better debugging
        console.error("Error calling Gemini Chat API:", error.message);
        return "I apologize, but I'm having trouble connecting right now.";
    }
}

// 💥 KEY CHANGE 4: Rename the exported function to maintain compatibility 
// with chatbotController.js, but point it to the new function.
module.exports = {
    getAIResponse: getAIResponseWithHistory,
};
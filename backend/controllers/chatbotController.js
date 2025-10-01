// // backend/controllers/chatbotController.js

// const { getAIResponse } = require('../services/geminiService');
// // Import other services as you build them (e.g., const { getWeather } = require('../services/weatherService');)

// /**
//  * Handles incoming chat messages from the frontend.
//  * For now, it just passes the message to the Gemini API.
//  * Later, it will check the message for intent (weather, location, general).
//  */
// async function handleChatMessage(req, res) {
//     const userMessage = req.body.message;

//     if (!userMessage) {
//         return res.status(400).json({ error: "Message is required." });
//     }

//     try {
//         // Step 1: **DETERMINE INTENT** (Future Step)
//         // Check if the message is asking for weather or location.
//         // For now, we treat every message as a general chat prompt.
        
//         // Step 2: **GET AI RESPONSE**
//         // You can add a system instruction to the prompt to make the AI act like 'Cove'.
//         const systemInstruction = "You are Cove, a helpful, friendly, and brief AI-powered guide for weather and exploration. Respond only to the user's message.";
//         const fullPrompt = `${systemInstruction}\n\nUser: ${userMessage}`;
        
//         const aiResponse = await getAIResponse(fullPrompt);

//         // Step 3: **SAVE TO DB** (Future Step)
//         // Save the userMessage and aiResponse to MongoDB.

//         // Step 4: **SEND RESPONSE**
//         res.json({ 
//             response: aiResponse,
//             // Later, you can send back structured data like weather data too
//         });

//     } catch (error) {
//         console.error('Error in chatbot controller:', error);
//         res.status(500).json({ error: 'Failed to process chat message.' });
//     }
// }

// module.exports = {
//     handleChatMessage,
// };

// // backend/controllers/chatbotController.js (Updated for Weather Intent)

// const { getAIResponse } = require('../services/geminiService');
// const { getCurrentWeather } = require('../services/weatherService'); // 💥 NEW IMPORT

// /**
//  * Handles incoming chat messages by detecting intent (weather, general) 
//  * and executing the appropriate tool (Weather API) before calling Gemini.
//  */
// async function handleChatMessage(req, res) {
//     const userMessage = req.body.message;

//     if (!userMessage) {
//         return res.status(400).json({ error: "Message is required." });
//     }

//     try {
//         let fullPrompt = `User: ${userMessage}`;
//         let aiResponse;
        
//         // The core system instruction for the AI (Cove's persona)
//         const systemInstruction = "You are Cove, a helpful, friendly, and brief AI-powered guide for weather and exploration. Respond only to the user's message.";


//         // ----------------------------------------------------
//         // 💥 STEP 1: INTENT DETECTION & TOOL EXECUTION (Weather)
//         // ----------------------------------------------------
        
//         const weatherKeywords = ['weather in', 'temperature in', 'forecast in'];
//         const isWeatherQuery = weatherKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

//         if (isWeatherQuery) {
//             // Attempt to extract the city name from the message
//             // Regex captures the text after keywords like "weather in "
//             const cityMatch = userMessage.match(/(?:weather in|temperature in|forecast in)\s+([\w\s,]+)/i);
//             const city = cityMatch ? cityMatch[1].trim() : null;
            
//             if (city) {
//                 const weatherData = await getCurrentWeather(city);
                
//                 if (weatherData) {
//                     console.log(`Weather data retrieved for ${city}. Conditions: ${weatherData.conditions}`);
                    
//                     // Instruct the AI to use the fetched data for actionable advice
//                     const weatherInstruction = `The user asked for weather in ${weatherData.city}. Here is the current data: ${JSON.stringify(weatherData)}. Based ONLY on this data, provide the current conditions and give simple, actionable advice (e.g., 'Take an umbrella' or 'It’s a great day for a walk').`;
                    
//                     // Prepend the specific instruction to guide the AI's response
//                     fullPrompt = weatherInstruction + "\n\n" + fullPrompt;
//                 } else {
//                     // Fallback if the weather API fails (e.g., city not found)
//                     aiResponse = `Sorry, I couldn't find current weather data for **${city}**. Please check the spelling or try another location.`;
//                 }
//             }
//         }
        
//         // ----------------------------------------------------
//         // 💥 STEP 2: GET AI RESPONSE
//         // ----------------------------------------------------
        
//         // Only call Gemini if a fallback response hasn't already been generated
//         if (!aiResponse) {
//             // Prepend the system instruction to the prompt before calling Gemini
//             const finalPrompt = `${systemInstruction}\n\n${fullPrompt}`;
//             aiResponse = await getAIResponse(finalPrompt);
//         }

//         // Step 3: **SAVE TO DB** (Future Step - Placeholder)
//         // Save the userMessage and aiResponse to MongoDB.

//         // ----------------------------------------------------
//         // 💥 STEP 4: SEND RESPONSE
//         // ----------------------------------------------------
//         res.json({ 
//             response: aiResponse,
//         });

//     } catch (error) {
//         console.error('Error in chatbot controller:', error);
//         res.status(500).json({ error: 'Failed to process chat message.' });
//     }
// }

// module.exports = {
//     handleChatMessage,
// };

// backend/controllers/chatbotController.js (Updated with MongoDB Context)

const { getAIResponse } = require('../services/geminiService');
const { getCurrentWeather } = require('../services/weatherService'); 
const Conversation = require('../models/Conversation'); // 💥 NEW IMPORT: Conversation Model

// We use a hardcoded ID for now. In a real app, this would come from a user session cookie.
const USER_ID = 'default_user_session'; 

/**
 * Converts Mongoose message objects into the Gemini API's content format.
 * @param {Array<Object>} messages - Array of Mongoose message objects.
 * @returns {Array<Object>} History array in Gemini format.
 */
function toGeminiHistory(messages) {
    return messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', // Gemini uses 'model' for bot responses
        parts: [{ text: msg.text }],
    }));
}

/**
 * Handles incoming chat messages by detecting intent, executing tools, 
 * loading context, and saving the new exchange.
 */
async function handleChatMessage(req, res) {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        let fullPrompt = userMessage; // Start with just the user message
        let aiResponse;
        let history = []; // Initialize history array

        // ----------------------------------------------------
        // 💥 STEP 1: LOAD CONTEXT (Load History from MongoDB)
        // ----------------------------------------------------
        let conversation = await Conversation.findOne({ userId: USER_ID });
        
        if (conversation) {
            // Convert and load existing messages into the history array
            history = toGeminiHistory(conversation.messages);
            // Optionally limit history size here to save tokens/cost
        }


        // ----------------------------------------------------
        // 💥 STEP 2: INTENT DETECTION & TOOL EXECUTION (Weather)
        // ----------------------------------------------------
        
        const weatherKeywords = ['weather in', 'temperature in', 'forecast in'];
        const isWeatherQuery = weatherKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

        if (isWeatherQuery) {
            const cityMatch = userMessage.match(/(?:weather in|temperature in|forecast in)\s+([\w\s,]+)/i);
            const city = cityMatch ? cityMatch[1].trim() : null;
            
            if (city) {
                const weatherData = await getCurrentWeather(city);
                
                if (weatherData) {
                    console.log(`Weather data retrieved for ${city}. Conditions: ${weatherData.conditions}`);
                    
                    // Create a focused instruction for the AI to process the data
                    const weatherInstruction = `The user asked for weather in ${weatherData.city}. Here is the data: ${JSON.stringify(weatherData)}. Based ONLY on this, provide the conditions and actionable advice.`;
                    
                    // The prompt sent to Gemini will now be the instruction + the user's original message
                    fullPrompt = weatherInstruction + "\n\nUser: " + userMessage;
                } else {
                    aiResponse = `Sorry, I couldn't find current weather data for **${city}**. Please check the spelling or try another location.`;
                }
            }
        }
        
        // ----------------------------------------------------
        // 💥 STEP 3: GET AI RESPONSE (Pass History)
        // ----------------------------------------------------
        
        if (!aiResponse) {
            // Call the updated Gemini service, passing the prompt AND the history
            aiResponse = await getAIResponse(fullPrompt, history);
        }

        // ----------------------------------------------------
        // 💥 STEP 4: SAVE NEW EXCHANGE (Save to MongoDB)
        // ----------------------------------------------------

        // 4a. If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({ userId: USER_ID, messages: [] });
        }
        
        // 4b. Add the new user message and bot response
        conversation.messages.push({ sender: 'user', text: userMessage });
        conversation.messages.push({ sender: 'bot', text: aiResponse });

        // 4c. Save the updated conversation document
        await conversation.save();


        // ----------------------------------------------------
        // 💥 STEP 5: SEND RESPONSE
        // ----------------------------------------------------
        res.json({ 
            response: aiResponse,
        });

    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({ error: 'Failed to process chat message.' });
    }
}

module.exports = {
    handleChatMessage,
};
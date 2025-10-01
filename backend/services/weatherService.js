// // backend/services/weatherService.js (FIXED for dotenv timing)

// const axios = require('axios');

// const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// /**
//  * Fetches current weather data for a specified city.
//  * The API key is accessed inside the function to ensure process.env is loaded.
//  * * @param {string} city - The name of the city (e.g., "London").
//  * @returns {Promise<Object|null>} A structured weather summary or null on failure.
//  */
// async function getCurrentWeather(city) {
//     // 💥 FIX: Access the key HERE, inside the async function, not at the top level
//     const API_KEY = process.env.OPENWEATHER_API_KEY;

//     if (!API_KEY) {
//         // This error check is now accurate
//         console.error("CRITICAL: OpenWeather API key is missing from environment variables. Check .env and server.js.");
//         return null;
//     }
    
//     try {
//         const response = await axios.get(BASE_URL, {
//             params: {
//                 q: city,
//                 appid: API_KEY, // Use the key read inside the function
//                 units: 'metric' // or 'imperial'
//             }
//         });
        
//         const data = response.data;
        
//         // Log successful connection only if data is retrieved
//         console.log(`Weather API Connection Successful for ${city}.`);

//         // Return a clean, structured summary for the AI to use
//         return {
//             city: data.name,
//             temp: data.main.temp,
//             conditions: data.weather[0].description,
//             icon: data.weather[0].icon,
//             tempMin: data.main.temp_min,
//             tempMax: data.main.temp_max,
//             humidity: data.main.humidity,
//             windSpeed: data.wind.speed
//         };

//     } catch (error) {
//         // Log the specific HTTP error code (like 401, 404, etc.)
//         const statusCode = error.response ? error.response.status : 'N/A';
//         console.error(`Error fetching weather for ${city}. Status Code: ${statusCode}. Message: ${error.message}`);
//         return null;
//     }
// }

// module.exports = { getCurrentWeather };

// backend/services/weatherService.js (Updated with Coords Function)

const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetches current weather data for a specified city (used by Chatbot for advice).
 * @param {string} city - The name of the city (e.g., "London").
 * @returns {Promise<Object|null>} A structured weather summary or null on failure.
 */
async function getCurrentWeather(city) {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
        console.error("CRITICAL: OpenWeather API key is missing from environment variables. Check .env and server.js.");
        return null;
    }
    
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY, 
                units: 'metric' // Use 'imperial' if you prefer Fahrenheit
            }
        });
        
        const data = response.data;
        
        // Log successful connection only if data is retrieved
        console.log(`Weather API Connection Successful for ${city}.`);

        // Return a clean, structured summary for the AI to use
        return {
            city: data.name,
            temp: data.main.temp,
            conditions: data.weather[0].description,
            icon: data.weather[0].icon,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

    } catch (error) {
        const statusCode = error.response ? error.response.status : 'N/A';
        console.error(`Error fetching weather for ${city}. Status Code: ${statusCode}. Message: ${error.message}`);
        return null;
    }
}

/**
 * Fetches full current weather data for specified coordinates (used by Metrics Page).
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Object|null>} The full OpenWeatherMap response object or null on failure.
 */
async function getCurrentWeatherByCoords(lat, lon) {
    const API_KEY = process.env.OPENWEATHER_API_KEY; // Access key inside function

    if (!API_KEY) {
        console.error("CRITICAL: OpenWeather API key is missing from environment variables.");
        return null;
    }
    
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                lat: lat, // Use latitude
                lon: lon, // Use longitude
                appid: API_KEY, 
                units: 'metric' // Use 'imperial' if you prefer Fahrenheit
            }
        });
        
        // Return the full data object for detailed display
        return response.data; 

    } catch (error) {
        const statusCode = error.response ? error.response.status : 'N/A';
        console.error(`Error fetching weather by coords. Status Code: ${statusCode}. Message: ${error.message}`);
        return null;
    }
}


// 💥 Export both functions!
module.exports = { getCurrentWeather, getCurrentWeatherByCoords };
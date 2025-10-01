// backend/routes/weatherRoutes.js

const express = require('express');
const router = express.Router();
const { getCurrentWeatherByCoords } = require('../services/weatherService'); 

// GET /api/weather/details?lat=X&lon=Y
router.get('/details', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    try {
        const weatherData = await getCurrentWeatherByCoords(lat, lon); 
        
        if (weatherData) {
            // Success: Return the full data structure
            return res.json(weatherData);
        }
        // Failure: Data not found
        res.status(404).json({ error: 'Weather data not found for coordinates.' });

    } catch (error) {
        console.error('Error in weatherRoutes /details:', error.message);
        res.status(500).json({ error: 'Failed to fetch detailed weather data.' });
    }
});

module.exports = router;
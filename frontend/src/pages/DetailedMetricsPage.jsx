// frontend/src/pages/DetailedMetricsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL for the new dedicated weather endpoint
const METRICS_API_URL = 'http://localhost:8050/api/weather/details';

// This component receives the location data from GeolocationManager via App.jsx
function DetailedMetricsPage({ userLocation }) {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userLocation) {
            setLoading(false);
            return;
        }

        const fetchMetrics = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch data using the user's coordinates
                const response = await axios.get(METRICS_API_URL, {
                    params: { 
                        lat: userLocation.lat, 
                        lon: userLocation.lon 
                    }
                });
                // We assume the backend returns the full OpenWeatherMap object
                setMetrics(response.data); 
            } catch (err) {
                console.error("Failed to fetch detailed metrics:", err);
                setError("Failed to load metrics. Server may be down or location is invalid.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [userLocation]); // Re-fetch whenever userLocation changes

    if (loading) return <div className="metrics-page">Loading personalized weather metrics...</div>;
    if (error) return <div className="metrics-page error-message">{error}</div>;
    if (!metrics) return <div className="metrics-page">Please enable location access to view detailed metrics.</div>;

    // Destructure key data for display
    const { name, main, wind, weather } = metrics;
    const weatherDescription = weather && weather.length > 0 ? weather[0].description : 'N/A';
    
    return (
        <div className="metrics-page">
            <h2>Detailed Weather Metrics for {name}</h2>
            <p className="description">Current Conditions: {weatherDescription}</p>
            <div className="metrics-grid">
                <div className="metric-item">
                    <strong>Temperature:</strong> {Math.round(main.temp)}°C
                </div>
                <div className="metric-item">
                    <strong>Feels Like:</strong> {Math.round(main.feels_like)}°C
                </div>
                <div className="metric-item">
                    <strong>Humidity:</strong> {main.humidity}%
                </div>
                <div className="metric-item">
                    <strong>Wind Speed:</strong> {wind.speed} m/s
                </div>
                <div className="metric-item">
                    <strong>Pressure:</strong> {main.pressure} hPa
                </div>
            </div>
            {/* Add more detailed metrics here */}
        </div>
    );
}

export default DetailedMetricsPage;
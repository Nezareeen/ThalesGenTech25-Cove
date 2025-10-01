// frontend/src/components/GeolocationManager.jsx

import React, { useState, useEffect } from 'react';

/**
 * Manages fetching the user's current geolocation.
 * Renders children and passes the userLocation object and any error status.
 */
function GeolocationManager({ children }) {
    // State for location: {lat: number, lon: number} or null
    const [userLocation, setUserLocation] = useState(null);
    // State for status/error messages
    const [status, setStatus] = useState('Requesting location...');

    useEffect(() => {
        // Check if the browser supports geolocation
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser. Cannot provide personalized features.");
            return;
        }

        // Request the user's current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success callback
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setStatus('Location access granted.');
                console.log('User location obtained:', position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Error callback (e.g., user denied access)
                console.error("Geolocation Error:", error.message);
                
                let errorMessage = 'Location access denied.';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location access was denied. Please allow location access for personalized features.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                }
                
                setStatus(errorMessage);
            }
        );
    }, []); // Empty dependency array ensures this runs only once on mount

    // ----------------------------------------------------
    // RENDERING LOGIC
    // ----------------------------------------------------
    
    // If we have coordinates, render the children and pass the data.
    if (userLocation) {
        // We clone and pass the children, injecting the userLocation prop
        return React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { userLocation, locationStatus: status });
            }
            return child;
        });
    }

    // While waiting for location or if there's an error, display status/loading
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>{status}</p>
            {/* You can add a simple loading spinner here */}
        </div>
    );
}

export default GeolocationManager;
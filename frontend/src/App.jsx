// // frontend/src/App.jsx (Corrected)

// import { useState } from 'react'
// import './App.css'

// // 💥 FIX: You must import the ChatbotContainer component 
// // from its file path so React can find it.
// import ChatbotContainer from './components/ChatbotContainer'; 

// function App() {


//   return (
//     // Removed the extraneous <></> fragment, though it was harmless.
//     <div className="App">
//       <ChatbotContainer />
//     </div>
//   )
// }

// export default App

// frontend/src/App.jsx (Updated with GeolocationManager)

import React from 'react'; // Keep React import
import './App.css'; 

// Import the components
import ChatbotContainer from './components/ChatbotContainer'; 
import GeolocationManager from './components/GeolocationManager'; // 💥 NEW IMPORT
import DetailedMetricsPage from './pages/DetailedMetricsPage';

function App() {
  return (
    <div className="App">
        {/* 💥 GeolocationManager handles fetching the location */}
        <GeolocationManager>
            
            {/* 💥 ChatbotContainer is rendered by GeolocationManager, 
               which injects userLocation and locationStatus props */}
            <ChatbotContainer />
            <hr style={{width: '600px', margin: '20px auto'}} />
            <DetailedMetricsPage /> 
        </GeolocationManager>
    </div>
  );
}

export default App;

/* NOTE: Removed unused imports like useState, reactLogo, viteLogo from the original App.jsx */
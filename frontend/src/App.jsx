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
import StartPage from './components/StartPage';
import SignupPage from './components/SignupPage';
import { useState } from 'react';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const handleShowSignup = () => setShowSignup(true);

  return (
    <div className="App">
      {!showSignup && <StartPage onSignUp={handleShowSignup} />}

      {showSignup && <SignupPage onBack={() => setShowSignup(false)} />}
    </div>
  );
}

export default App;

/* NOTE: Removed unused imports like useState, reactLogo, viteLogo from the original App.jsx */
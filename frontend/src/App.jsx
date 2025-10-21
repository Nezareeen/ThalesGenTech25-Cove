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

// import React from 'react'; // Keep React import
// import './App.css'; 

// // Import the components
// import ChatbotContainer from './components/ChatbotContainer'; 
// import GeolocationManager from './components/GeolocationManager'; // 💥 NEW IMPORT
// import DetailedMetricsPage from './pages/DetailedMetricsPage';
// import TestingLiquidGlass from './components/TestingLiquidGlass'; // 💥 NEW IMPORT for testing liquid glass

// function App() {

//   return (
//     <div>
//       {/* Temporarily showing TestingLiquidGlass for testing purposes */}
//       <TestingLiquidGlass />
      
//       {/* Commented out other components for now - uncomment when ready */}
//       {/* <GeolocationManager>
//         <ChatbotContainer />
//         <DetailedMetricsPage />
//       </GeolocationManager> */}
//     </div>
//   );
// }

// export default App;

/* NOTE: Removed unused imports like useState, reactLogo, viteLogo from the original App.jsx */

import React, { useState } from 'react';
import './App.css';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const [route, setRoute] = useState('start'); // 'start' | 'login'

  if (route === 'start') {
    return <StartPage onNext={() => setRoute('login')} />;
  }

  if (route === 'login') {
    return <LoginPage onBack={() => setRoute('start')} onSignup={() => setRoute('signup')} />;
  }

  if (route === 'signup') {
    return <SignupPage onBack={() => setRoute('login')} />;
  }

  return null;
}

export default App;
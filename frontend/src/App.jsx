// frontend/src/App.jsx (Corrected)

import { useState } from 'react'
import './App.css'

// 💥 FIX: You must import the ChatbotContainer component 
// from its file path so React can find it.
import ChatbotContainer from './components/ChatbotContainer'; 

function App() {


  return (
    // Removed the extraneous <></> fragment, though it was harmless.
    <div className="App">
      <ChatbotContainer />
    </div>
  )
}

export default App
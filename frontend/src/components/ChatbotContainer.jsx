// // frontend/src/components/ChatbotContainer.jsx

// import React, { useState } from 'react';
// import axios from 'axios';
// import './Chatbot.css'; // We'll create this file next

// // Base URL for your backend server
// // Adjust the port if your backend is running on something other than 5000
// const BACKEND_URL = 'http://localhost:8050/api/chat';

// function ChatbotContainer() {
//   // State to store the conversation history
//   const [messages, setMessages] = useState([
//     { sender: 'bot', text: "Hello! I am Cove, your AI guide. How can I help you with the weather or exploration today?" }
//   ]);
  
//   // State for the text input field
//   const [input, setInput] = useState('');
  
//   // State for loading status while waiting for the AI response
//   const [isLoading, setIsLoading] = useState(false);

//   // --- Function to handle sending the message ---
//   const handleSendMessage = async () => {
//     if (input.trim() === '' || isLoading) return;

//     const userMessage = input.trim();
    
//     // 1. Add user message to state and clear input
//     const newUserMessage = { sender: 'user', text: userMessage };
//     setMessages(prevMessages => [...prevMessages, newUserMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // 2. Send message to the backend
//       const response = await axios.post(BACKEND_URL, { 
//         message: userMessage 
//       });

//       const botMessage = response.data.response || "I received no response from the AI.";

//       // 3. Add bot's response to state
//       setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botMessage }]);

//     } catch (error) {
//       console.error('Error sending message:', error);
//       // Display a friendly error message
//       setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Error: Could not connect to the Cove AI server.' }]);
//     } finally {
//       setIsLoading(false);
//       // Optional: Auto-scroll to the bottom of the chat window
//       const chatWindow = document.querySelector('.message-list');
//       if (chatWindow) {
//         chatWindow.scrollTop = chatWindow.scrollHeight;
//       }
//     }
//   };

//   // Allow sending by pressing Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <h2>Cove: Your AI Guide</h2>
      
//       {/* Message Display Area */}
//       <div className="message-list">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message-bubble ${msg.sender}`}>
//             <span className="sender-label">{msg.sender === 'user' ? 'You:' : 'Cove:'}</span>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//         {/* Loading indicator */}
//         {isLoading && (
//           <div className="message-bubble bot loading">
//             <span className="sender-label">Cove:</span>
//             <p>...</p>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="input-area">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder={isLoading ? "Cove is thinking..." : "Ask me about the weather or places to visit..."}
//           disabled={isLoading}
//         />
//         <button onClick={handleSendMessage} disabled={isLoading}>
//           {isLoading ? 'Sending...' : 'Send'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatbotContainer;


// frontend/src/components/ChatbotContainer.jsx (Updated to accept Geolocation Props)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; 

// Base URL for your backend server
const BACKEND_URL = 'http://localhost:8050/api/chat';

// 💥 Component now accepts userLocation and locationStatus props
function ChatbotContainer({ userLocation, locationStatus }) { 
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I am Cove, your AI guide. How can I help you with the weather or exploration today?" }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 💥 NEW: Effect to react when location is obtained
  useEffect(() => {
    if (userLocation) {
        // You can use this to adjust the greeting or send the coordinates to the backend
        console.log("Chatbot now knows the user's coordinates:", userLocation.lat, userLocation.lon);
    }
  }, [userLocation]); // Re-run when userLocation changes

  // --- Function to handle sending the message ---
  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = input.trim();
    
    // 1. Add user message to state and clear input
    const newUserMessage = { sender: 'user', text: userMessage };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Send message to the backend
      const response = await axios.post(BACKEND_URL, { 
        message: userMessage,
        // 💥 NEW: Optionally send location data with the message for personalized advice
        userLocation: userLocation 
      });

      const botMessage = response.data.response || "I received no response from the AI.";

      // 3. Add bot's response to state
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botMessage }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Error: Could not connect to the Cove AI server.' }]);
    } finally {
      setIsLoading(false);
      const chatWindow = document.querySelector('.message-list');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }
  };

  // Allow sending by pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Cove: Your AI Guide</h2>
      
      {/* 💥 Display Location Status */}
      <p style={{textAlign: 'center', fontSize: '0.8em', color: userLocation ? 'green' : 'red', margin: '5px 0'}}>
        {locationStatus}
      </p>
      
      {/* Message Display Area */}
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <span className="sender-label">{msg.sender === 'user' ? 'You:' : 'Cove:'}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {/* Loading indicator */}
        {isLoading && (
          <div className="message-bubble bot loading">
            <span className="sender-label">Cove:</span>
            <p>...</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "Cove is thinking..." : "Ask me about the weather or places to visit..."}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatbotContainer;
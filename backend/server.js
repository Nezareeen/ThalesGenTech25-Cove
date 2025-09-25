// backend/server.js

const express = require('express');
const cors = require('cors'); // You'll need this for frontend communication
const dotenv = require('dotenv');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Load environment variables - THIS MUST BE THE FIRST EXECUTABLE LINE
dotenv.config(); 

const app = express();
// ... db connection setup (assuming you'll add it here later)

// Middleware
app.use(cors()); // Configure CORS options if needed
app.use(express.json()); // To parse JSON bodies from the frontend

// API Routes
app.use('/api', chatbotRoutes); 
// Add other routes here: app.use('/api/weather', weatherRoutes);

// Use the PORT from .env or default to 5000
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
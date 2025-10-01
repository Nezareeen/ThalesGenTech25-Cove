// backend/server.js (Updated with MongoDB Integration)

const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const chatbotRoutes = require('./routes/chatbotRoutes');
const connectDB = require('./config/db'); // 💥 NEW: Import the database connection function
const weatherRoutes = require('./routes/weatherRoutes');

// Load environment variables - THIS MUST BE THE FIRST EXECUTABLE LINE
dotenv.config(); 

// 💥 NEW: Connect to the database
connectDB(); 

const app = express();
// The database connection is handled above, so no need for the placeholder comment

// Middleware
app.use(cors()); // Configure CORS options if needed
app.use(express.json()); // To parse JSON bodies from the frontend
app.use('/api/weather', weatherRoutes);

// API Routes
app.use('/api', chatbotRoutes); 
// Add other routes here: app.use('/api/weather', weatherRoutes);

// Use the PORT from .env or default to 5000
const PORT = process.env.PORT || 8050; // Using 8050 as you used it recently
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
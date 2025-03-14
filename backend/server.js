require('dotenv').config();
console.log("Google API Key:", process.env.GOOGLE_API_KEY);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const confessionRoutes = require('./routes/confessionRoutes');
const journalRoutes = require('./routes/journalRoutes'); // Ensure journal routes are included
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/confessions', confessionRoutes);
app.use('/api/journal-entries', journalRoutes); // Keep journal API routes

// Basic route
app.get('/', (req, res) => {
  res.send('StudyZen Confessions API is running');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3001`);
});

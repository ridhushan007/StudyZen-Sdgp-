require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const confessionRoutes = require('./routes/confessionRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/confessions', confessionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('StudyZen Confessions API is running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
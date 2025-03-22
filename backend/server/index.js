const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// MongoDB Event Listeners
db.on('connected', () => console.log('✅ MongoDB Connected'));
db.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1); // Exit process if DB connection fails
});
db.on('disconnected', () => console.log('⚠️ MongoDB Disconnected'));

// Enable Debugging (Optional)
mongoose.set('debug', true);

// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('University Student App API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

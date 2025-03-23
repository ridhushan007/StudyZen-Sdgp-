require('dotenv').config(); // Load environment variables
console.log("Google API Key:", process.env.GOOGLE_API_KEY);

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const confessionRoutes = require('./routes/confessionRoutes');
const journalRoutes = require('./routes/journalRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes'); // Make sure you have this file

// Error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust if needed
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach any custom Socket.IO logic
require('./socket/chatSocket')(io);

// Make io accessible in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =============================
//            Routes
// =============================

// Authentication Routes
app.use('/api/auth', authRoutes);

// Other API Routes
app.use('/api/confessions', confessionRoutes);
app.use('/api/journal-entries', journalRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('StudyZen API is running');
});

// Error Handling Middleware
app.use(errorHandler);

// =============================
//          Start Server
// =============================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
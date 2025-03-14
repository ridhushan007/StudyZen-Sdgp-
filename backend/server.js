require('dotenv').config();
console.log("Google API Key:", process.env.GOOGLE_API_KEY);
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); // Standardizing import
const connectDB = require('./config/db');
const confessionRoutes = require('./routes/confessionRoutes');
const journalRoutes = require('./routes/journalRoutes'); // Ensure journal routes are included
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Attach chat socket handlers
require('./socket/chatSocket')(io);

// Make io accessible to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/confessions', confessionRoutes);
app.use('/api/journal-entries', journalRoutes); // Keep journal API routes

// Basic route
app.get('/', (req, res) => {
  res.send('StudyZen Confessions API is running');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const confessionRoutes = require('./routes/confessionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

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

// Error handling middleware
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// Attach chat socket handlers
require('./socket/chatSocket')(io);

// Start the server (only one listen call)
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
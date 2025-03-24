require('dotenv').config();
console.log("Google API Key:", process.env.GOOGLE_API_KEY);
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); // Standardizing import
// const connectDB = require('./config/db');
const confessionRoutes = require('./routes/confessionRoutes');
const journalRoutes = require('./routes/journalRoutes'); // Ensure journal routes are included
const errorHandler = require('./middleware/errorHandler');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const mongoose = require('mongoose');
const studyRoutes = require("./routes/studyRoutes.js");
const StudySession = require("./models/StudySession.js");
const cron = require("node-cron");

const recentActivityRoutes = require('./routes/recentActivityRoutes'); 
const bodyParser = require('body-parser');
const weekCountRoutes = require('./routes/week-count');



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};



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
app.use(bodyParser.json()); 

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

// Routes for dashboard
app.use('/api/dashboard', dashboardRoutes);

//Routes for study Hours
app.use("/api", studyRoutes);
//Routes for recent activity
app.use("/api/recent-activities", recentActivityRoutes);

// Route to get quiz count
app.use('/api/quizzes', weekCountRoutes);

// Reset total study time at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Resetting study time at midnight...");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Find all users and create a record for the new day
  const users = await StudySession.distinct("userId");

  for (const userId of users) {
    const newSession = new StudySession({
      userId,
      date: new Date().toISOString().split("T")[0],
      totalStudyTime: 0,
    });
    await newSession.save();
  }

  console.log("Study time reset for all users.");
});

//Routes for current streak
//app.use('/api/streaks', require('./routes/streakRoutes'));
//app.use('/api', streakRoutes


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


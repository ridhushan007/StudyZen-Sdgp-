const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const confessionsRouter = require('./routes/confessions');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/confessions', confessionsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
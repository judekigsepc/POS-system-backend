require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { initSocket } = require('./functions/rtFunctions'); // Import the socket module

// Route imports
const addRouter = require('./routes/add.route');
const getRouter = require('./routes/get.route');
const deleteRouter = require('./routes/delete.route');
const updateRouter = require('./routes/update.route');
const authRouter = require('./routes/auth.route');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with the server
initSocket(server);

// Database Connection
const dbURI = process.env.dbURL;
mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to DB successfully'))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.get('/', (req, res) => {
  res.send('POS SERVER IS UP AND RUNNING');
});
app.use('/api/add', addRouter);
app.use('/api/get', getRouter);
app.use('/api/delete', deleteRouter);
app.use('/api/update', updateRouter);
app.use('/api/auth', authRouter);

// Start Server
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`POS server running on port ${port}`));

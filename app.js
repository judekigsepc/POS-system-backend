require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { initSocket,generalErrorHandler,notifyer } = require('./functions/rtFunctions'); // Import the socket module

// Route imports
const productRouter = require('./routes/product.route')
const businessRouter = require('./routes/business.route')
const configRouter = require('./routes/config.route')
const userRouter = require('./routes/user.route')
const transactionRouter = require('./routes/transaction.route')
const categoryRouter = require('./routes/category.route')
const authRouter = require('./routes/auth.route');


const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with the server
initSocket(server);

// Database Connection
const dbURI = process.env.dbURL;
const dbConnect = async () =>{
  try {
    await mongoose.connect(dbURI)
    console.log('Connected to database successfuly')
    notifyer('Connected to database succesfully')
  }
  catch(err) {
    console.log(`Error connecting to DB: ${err}`)
    dbConnect()
    return generalErrorHandler('Error connecting to database- Please check your internet connection')
  }
} 
dbConnect()

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/public', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send('POS SERVER IS UP AND RUNNING');
});
app.use('/api/products', productRouter);
app.use('/api/config', configRouter);
app.use('/api/business', businessRouter);
app.use('/api/users', userRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/auth', authRouter);

// Start Server
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`POS server running on port ${port}`));

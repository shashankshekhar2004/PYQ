const mongoose = require('mongoose');
require('dotenv').config();

// Load the MongoDB connection string from the .env file
const mongoURL = process.env.mongoURL;

// Establish a connection to the MongoDB database
mongoose.connect(mongoURL);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (to get notification of successful connection)
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Export the database connection
module.exports = { db };

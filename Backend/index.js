// Import necessary modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
const { StudentUploadRouter } = require('./routes/StudentuploadPyq.routes');
const { AdminUploadRouter } = require('./routes/AdminUpload.routes');
require('dotenv').config();
const { db } = require('./dbVerified');
const { SearchRouter } = require('./routes/fetchPyq.routes');
const { AdminSearchRouter } = require('./routes/AdminDownload.routes');
const { LoginRouter } = require('./routes/Login.routes');
const connectToDatabase = require('./dbVerified');
const { AdminVerifyForDownload } = require('./routes/AdminverifyForDownload.routes');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;


// Middleware setup
app.use(cors()) // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// connectToDatabase;

// Basic route for server status check
app.get('/', (req, res) => {
    res.send({
        message: "Server is working!"
    });
});



app.use('/student', StudentUploadRouter); // Handle student-related routes
app.use('/admindownload', AdminSearchRouter); // Handle admin search/download routes
app.use('/adminupload', AdminUploadRouter); // Handle admin upload routes
app.use('/search', SearchRouter); // Handle search routes
app.use('/login', LoginRouter); // Handle login routes
app.use('/adminverifydownload', AdminVerifyForDownload);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

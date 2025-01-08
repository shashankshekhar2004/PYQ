const express = require('express'); // Import the Express library
const multer = require('multer'); // Import the Multer library for handling file uploads
const { MongoClient } = require('mongodb'); // Import MongoClient from MongoDB
const { GridFSBucket } = require('mongodb'); // Import GridFSBucket from MongoDB
require('dotenv').config(); // Load environment variables from .env file


const connectToDatabase = require('../dbVerified.js');

// Create a new Express Router for handling file upload requests
const AdminUploadRouter = express.Router();

// Configure Multer for in-memory storage of uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Declare a variable to hold the GridFSBucket instance
let gridFSBucket;

// Function to initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase(); // Connect to the database
    gridFSBucket = new GridFSBucket(db); // Initialize GridFSBucket
}

// Initialize GridFSBucket
initializeGridFSBucket();

// Route to handle file upload
AdminUploadRouter.post("/upload-files", upload.single("file"), async (req, res) => {
    try {
        const file = req.file; // Get the uploaded file from the request
        const fname = req.body.filename; // Get the filename from the request body
        if (!file) {
            return res.status(400).send('No file uploaded.'); // Return error if no file is uploaded
        }

        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.'); // Return error if GridFSBucket is not initialized
        }

        // Create an upload stream for GridFSBucket with the provided filename
        const uploadStream = gridFSBucket.openUploadStream(fname);

        // Write the file buffer to the upload stream
        uploadStream.write(file.buffer);
        uploadStream.end(); // End the upload stream

        // Send response when upload is finished
        uploadStream.on('finish', () => {
            res.send('File uploaded successfully to MongoDB.'); // Send success message
        });
    } catch (error) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).send('Error uploading file to MongoDB.'); // Return error response if an exception occurs
    }
});

module.exports = {
    AdminUploadRouter
};

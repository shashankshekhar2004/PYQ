// Import necessary modules
const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();


const connectToDatabase = require('../dbStudentUpload.js');

// Create an Express Router for handling student upload routes
const StudentUploadRouter = express.Router();

// Configure Multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize GridFSBucket to handle file storage in MongoDB
let gridFSBucket;
async function initializeGridFSBucket() {
    const db = await connectToDatabase(); // Connect to MongoDB
    gridFSBucket = new GridFSBucket(db); // Initialize GridFSBucket with the database instance
}
initializeGridFSBucket(); // Initialize GridFSBucket during startup

// Define a route for uploading files
StudentUploadRouter.post("/upload-files", upload.single("file"), async (req, res) => {
    try {
        const file = req.file; // Get the uploaded file
        const { year, branch, email, subjectcode } = req.body; // Destructure req.body to get additional metadata

        // Check if a file was uploaded
        if (!file) {
            return res.status(400).send('No file was selected.');
        }

        // Check if GridFSBucket is initialized
        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        // Create an upload stream to GridFS with metadata
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, 
            {
            metadata: {
                year: year,
                branch: branch,
                email: email,
                subjectcode: subjectcode,
                verified: 0
            }
        });

        // Write file buffer to GridFS and end the stream
        uploadStream.write(file.buffer);
        uploadStream.end();

        // Respond when upload is finished
        uploadStream.on('finish', () => {
            res.send({
                message: "File uploaded successfully",
                status: 1
            });
        });
    } catch (error) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).send('Error uploading file to MongoDB.');
    }
});

// Export the router for use in other modules
module.exports = {
    StudentUploadRouter
};

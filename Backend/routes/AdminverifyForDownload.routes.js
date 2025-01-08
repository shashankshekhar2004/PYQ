const express = require('express'); // Import the Express library for handling HTTP requests
const multer = require('multer'); // Import Multer for handling file uploads
const { GridFSBucket } = require('mongodb'); // Import GridFSBucket for streaming files in GridFS
const cors = require('cors'); // Import CORS middleware for handling Cross-Origin Resource Sharing
require('dotenv').config(); // Load environment variables from .env file
const { MongoClient } = require('mongodb');
dbName = 'pyq';

const connectToDatabase = require('../dbStudentUpload.js');
const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);
// Create a new Express Router for handling file search requests
const AdminVerifyForDownload = express.Router();
AdminVerifyForDownload.use(cors()); // Use CORS middleware to handle cross-origin requests


let gridFSBucket;


// Function to initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase(); // Connect to the database
    gridFSBucket = new GridFSBucket(db); // Initialize GridFSBucket for file streaming
}

initializeGridFSBucket();


AdminVerifyForDownload.post("/", async (req, res) => {
    try {
        const db = client.db(dbName); // Access the database

        // Fetch unverified files
        const result = await db.collection('fs.files').find({ "metadata.verified": 0 }).toArray();

        console.log(result);

        // Extract and process filenames
        const array = result.map(file => {
            if (file.filename) {
                // Remove the last 4 characters of the filename
                return file.filename.slice(0, -4);
            }
            return null; // Handle cases where filename might be missing
        }).filter(filename => filename !== null); // Filter out null entries

        res.status(200).json({ unverifiedFiles: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});






module.exports = {
    AdminVerifyForDownload
};

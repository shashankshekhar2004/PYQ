// Import necessary modules
const express = require('express'); // For creating the Express application
const multer = require('multer'); // For handling file uploads
const { MongoClient } = require('mongodb'); // MongoDB client for database operations
const { GridFSBucket } = require('mongodb'); // GridFSBucket for handling large files in MongoDB
require('dotenv').config(); // For loading environment variables from a .env file
const cors = require('cors'); // For handling Cross-Origin Resource Sharing (CORS)
const dbName='realPyq';

const connectToDatabase = require('../dbVerified.js');

// Create an Express Router for handling search-related routes
const SearchRouter = express.Router();
SearchRouter.use(cors()); // Enable CORS for this router

const mongoURI = process.env.mongoURL;

const client = new MongoClient(mongoURI);

// Initialize GridFSBucket instance for handling file storage
let gridFSBucket;

async function initializeGridFSBucket() {
    const db = await connectToDatabase(); // Connect to the database
    gridFSBucket = new GridFSBucket(db); // Create GridFSBucket instance
}

// Call the function to initialize GridFSBucket
initializeGridFSBucket();

// Route to search for files and send them as a response
SearchRouter.post("/search-files", async (req, res) => {
    try {
        const fileName = req.body.filename; // Get filename from request body
        if (!fileName) {
            return res.status(400).send('Filename is required.'); // Return error if filename is not provided
        }
        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.'); // Return error if GridFSBucket is not initialized
        }

        // Get collections for files and chunks
        const collection = client.db(dbName).collection('fs.files');
        const collectionChunks = client.db(dbName).collection('fs.chunks');

        // Find files with the given filename
        const cursor = await collection.find({ filename: fileName });
        const docs = await cursor.toArray();

        if (docs.length === 0) {
            return res.status(404).send('No file found'); // Return error if no file is found
        }

        // Optionally handle multiple files (commented out)
        // if (docs.length > 1) {
        //     // If multiple files found, zip them and send as a single zip file
        //     // Implement zip logic here
        //     return res.status(400).send('Multiple files found. Downloading multiple files is not supported yet.');
        // }

        // Get the first file's details
        const file = docs[0];
        // Find and sort chunks of the file
        const chunks = await collectionChunks.find({ files_id: file._id }).sort({ n: 1 }).toArray();
        // const chunks = await collectionChunks.find({ files_id: file._id }).toArray();
        if (!chunks || chunks.length === 0) {
            return res.status(404).send('No data found'); // Return error if no data chunks are found
        }

        // Concatenate all chunks to form the complete file data
        let fileData = [];
        chunks.forEach(chunk => {
            fileData.push(chunk.data.buffer);
        });

        const pdfData = Buffer.concat(fileData); // Combine chunks into a single Buffer
        res.setHeader('Content-Type', 'application/pdf'); // Set the content type to PDF
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`); // Set the filename for download
        res.send(pdfData); // Send the PDF data as the response

    } catch (error) {
        console.error('Error searching or sending files in MongoDB:', error);
        res.status(500).send('Error searching or sending files in MongoDB.'); // Handle and send error message
    }
});

module.exports = {
    SearchRouter // Export the router to be used in other parts of the application
};

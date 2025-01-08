const express = require('express'); // Import the Express library for handling HTTP requests
const multer = require('multer'); // Import Multer for handling file uploads
const { MongoClient } = require('mongodb'); // Import MongoClient for MongoDB operations
const { GridFSBucket } = require('mongodb'); // Import GridFSBucket for streaming files in GridFS
const cors = require('cors'); // Import CORS middleware for handling Cross-Origin Resource Sharing
require('dotenv').config(); // Load environment variables from .env file
dbName = 'pyq'
const mongoURI = process.env.mongoURL;
const client = new MongoClient(mongoURI);

const connectToDatabase = require('../dbStudentUpload.js');
// Create a new Express Router for handling file search requests
const AdminSearchRouter = express.Router();
AdminSearchRouter.use(cors()); // Use CORS middleware to handle cross-origin requests

// Configure Multer for in-memory storage of uploaded files (though not used in this route)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Declare a variable to hold the GridFSBucket instance
let gridFSBucket;

// Function to initialize GridFSBucket
async function initializeGridFSBucket() {
    const db = await connectToDatabase(); // Connect to the database
    gridFSBucket = new GridFSBucket(db); // Initialize GridFSBucket for file streaming
}

// Initialize GridFSBucket
initializeGridFSBucket();

// Route to handle file search and retrieval
AdminSearchRouter.post("/search-files", async (req, res) => {
    try {
        const fileName = req.body.filename; // Get the filename from the request body
        console.log(fileName)
        if (!fileName) {
            return res.status(400).send('Filename is required.'); // Return error if filename is missing
        }
        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.'); // Return error if GridFSBucket is not initialized
        }

        // Get collections for files and chunks from the database
        const collection = client.db(dbName).collection('fs.files');
        const collectionChunks = client.db(dbName).collection('fs.chunks');

        // Find file documents matching the filename
        const docs = await collection.find({ filename: fileName }).toArray();

        if (docs.length === 0) {
            return res.status(404).send('No file found'); // Return error if no file is found
        }

        // Get the first file document
        const file = docs[0];

        // Find chunks associated with the file and sort by chunk number
        const chunks = await collectionChunks.find({ files_id: file._id }).sort({ n: 1 }).toArray();
        if (!chunks || chunks.length === 0) {
            return res.status(404).send('No data found'); // Return error if no data chunks are found
        }

        // Concatenate all chunks to form the complete file data
        let fileData = [];
        chunks.forEach(chunk => {
            fileData.push(chunk.data.buffer);
        });

        const pdfData = Buffer.concat(fileData); // Combine all chunks into a single buffer
        res.setHeader('Content-Type', 'application/pdf'); // Set the content type to PDF
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`); // Set content disposition to attachment with the filename
        res.send(pdfData); // Send the file data as the response


        // Update the metadata.verified field to 1
        await collection.updateOne(
            { _id: file._id }, // Match the file document by its ID
            { $set: { "metadata.verified": 1 } } // Update the metadata.verified field
        );
        console.log(`File metadata.verified updated for file: ${fileName}`);

    } catch (error) {
        console.error('Error searching or sending files in MongoDB:', error);
        res.status(500).send('Error searching or sending files in MongoDB.'); // Return error response if an exception occurs
    }
});



module.exports = {
    AdminSearchRouter
};

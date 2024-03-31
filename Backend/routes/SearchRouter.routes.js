const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const mongoURI = process.env.mongoURL;
const dbName = "realPyq";
 
const client = new MongoClient(mongoURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(dbName);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Throw error to handle it in the calling function
    }
}

const SearchRouter = express.Router();
SearchRouter.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let gridFSBucket;

async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}

initializeGridFSBucket();

SearchRouter.post("/search-files", async (req, res) => {
    try {
        const fileName = req.body.filename;
        if (!fileName) {
            return res.status(400).send('Filename is required.');
        }
        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const collection = client.db(dbName).collection('fs.files');
        const collectionChunks = client.db(dbName).collection('fs.chunks');

        const cursor = await collection.find({ filename: fileName });
        const docs = await cursor.toArray();

        if (docs.length === 0) {
            return res.status(404).send('No file found');
        }

        // if (docs.length > 1) {
        //     // If multiple files found, zip them and send as a single zip file
        //     // Implement zip logic here
        //     return res.status(400).send('Multiple files found. Downloading multiple files is not supported yet.');
        // }

        const file = docs[0];
        const chunks = await collectionChunks.find({ files_id: file._id }).sort({ n: 1 }).toArray();
        if (!chunks || chunks.length === 0) {
            return res.status(404).send('No data found');
        }

        let fileData = [];
        chunks.forEach(chunk => {
            fileData.push(chunk.data.buffer);
        });

        const pdfData = Buffer.concat(fileData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.send(pdfData);

    } catch (error) {
        console.error('Error searching or sending files in MongoDB:', error);
        res.status(500).send('Error searching or sending files in MongoDB.');
    }
});



module.exports = {
    SearchRouter
};

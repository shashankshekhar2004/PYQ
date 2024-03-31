const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

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
        process.exit(1);
    }
}

const AdminUploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let gridFSBucket;

async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}

initializeGridFSBucket();

AdminUploadRouter.post("/upload-files", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const fname = req.body.filename
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        if (!gridFSBucket) {
            return res.status(500).send('GridFSBucket is not initialized.');
        }

        const uploadStream = gridFSBucket.openUploadStream(filename = fname);

        uploadStream.write(file.buffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
            res.send('File uploaded successfully to MongoDB.');
        });
    } catch (error) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).send('Error uploading file to MongoDB.');
    }
});
 
module.exports = {
    AdminUploadRouter
};

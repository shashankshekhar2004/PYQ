const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
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

const SearchRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let gridFSBucket;

async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}

initializeGridFSBucket();

// SearchRouter.post("/search-files", async (req, res) => {
//     try {
//         const myFileName = req.body.fname;
//         console.log("222")
//         if (!myFileName) {
//             return res.status(400).send('Filename is required.');
//         }

//         if (!gridFSBucket) {
//             return res.status(500).send('GridFSBucket is not initialized.');
//         }

//         const searchCursor = gridFSBucket.find({
//             filename: myFileName
//         });

//         const searchResults = [];
//         searchCursor.on('data', (file) => {
//             searchResults.push(file);
//         });

//         searchCursor.once('end', () => {
//             res.send(searchResults);
//         });

//     } catch (error) {
//         console.error('Error searching or sending  files in MongoDB:', error);
//         res.status(500).send('Error searching or sending  files in MongoDB.');
//     }
// });

SearchRouter.post("/search-files", async (req, res) => {
    try {
        const myFileName = req.body.fname;
        let files = await gridFSBucket.files.find({filename: myFileName}).toArray();
        res.json({files})
    } catch (err) {
        res.send(err)
        console.log(err)
    }
 });

module.exports = {
    SearchRouter
};

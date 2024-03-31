const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
const { StudentUploadRouter } = require('./routes/Studentupload.routes');
const { AdminUploadRouter } = require('./routes/AdminUpload.routes');
require('dotenv').config();
const { db } = require('./db');
const { SearchRouter } = require('./routes/SearchRouter.routes');
const { AdminSearchRouter } = require('./routes/AdminSearch.routes');
const { LoginRouter } = require('./routes/Login.routes');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const mongoURI = process.env.mongoURL;
const dbName = "pyq";

// Create a MongoDB client
const client = new MongoClient(mongoURI);

// Initialize the MongoDB connection and database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(dbName);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if unable to connect to MongoDB
    }
}



// Reusable GridFSBucket
let gridFSBucket;

// Initialize GridFSBucket during server startup
async function initializeGridFSBucket() {
    const db = await connectToDatabase();
    gridFSBucket = new GridFSBucket(db);
}

initializeGridFSBucket();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send({
        message: "Server is working!"
    });
});

app.use('/student', StudentUploadRouter);
app.use('/admindownload', AdminSearchRouter);

app.use('/adminupload', AdminUploadRouter);
app.use('/search',SearchRouter)
app.use('/login',LoginRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.get("/upload-files", upload.single("file"), async (req, res) => {
//     try {
//         const file = req.file;
//         if (!file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         // Ensure GridFSBucket is initialized
//         if (!gridFSBucket) {
//             return res.status(500).send('GridFSBucket is not initialized.');
//         }

//         // Create upload stream
//         const uploadStream = gridFSBucket.openUploadStream(file.originalname);

//         // Pipe file buffer to GridFS
//         uploadStream.write(file.buffer);
//         uploadStream.end();

//         uploadStream.on('finish', () => {
//             res.send('File uploaded successfully to MongoDB.');
//         });
//     } catch (error) {
//         console.error('Error uploading file to MongoDB:', error);
//         res.status(500).send('Error uploading file to MongoDB.');
//     }
// });



const express = require("express");
const { fileStoreController, fileRetreiveController } = require("../Controllers/FileController");
const router = express.Router();
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');





/*********************************************  GRID-FS-CONFIGURATION ************************************************/

// Mongo URI
const mongoURI = 'mongodb+srv://root:root@share.muq2zac.mongodb.net/CodeStream?retryWrites=true&w=majority&appName=share';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

// Create Grid Stream...
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine....
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);

                // Generate random 4-digit number for each file upload
                const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: {
                        code: randomDigits,
                        countExpire: 0
                    }
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });






/*********************************************  FILES - ALL - ROUTES - CONTROLLERS  ************************************************/

// File Store route...
router.post("/file-store", upload.single('file'), async (req, res) => {
    const randomCode = req.file.metadata.code;
    res.status(201).send({ message: "File uploaded successfully...", success: true, code: randomCode });
});


// File Get route....
// router.get("/file-retreive/:fileCode", async (req, res) => {
//     try {
//         const fileCode = req.params.fileCode;
//         console.log('Fetching file:', fileCode);

//         const file = await gfs.files.findOne({ "metadata.code": fileCode });
//         if (!file || file.length === 0) {
//             console.log('File not found:', fileCode);
//             return res.status(404).json({ error: 'No file exists' });
//         }

//         const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//             bucketName: 'uploads',
//         });

//         const readStream = gridfsBucket.openDownloadStream(file._id);
//         const writeStream = fs.createWriteStream(`S:/PROGRAMS/Mern_Stack Projects/Internship Projects  🔐🔐🔐/CodeCraft Projects/server/ExtractedFiles/${file.filename}`);

//         readStream.pipe(writeStream); 

//         readStream.on('error', (err) => {
//             console.error('Error reading file stream:', err);
//             return res.status(500).json({ error: 'Error reading file stream' });
//         });

//         writeStream.on('finish', () => {
//             console.log('File saved successfully');
//             res.status(200).json({ message: 'File saved successfully' });
//         });

//     } catch (err) {
//         console.error('Error finding file:', err);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });


router.get("/file-retrieve/:fileCode", async (req, res) => {
    try {
        const fileCode = req.params.fileCode;
        console.log('Fetching file:', fileCode);

        //Check file is exist or not...
        const file = await gfs.files.findOne({ "metadata.code": fileCode });
        if (!file || file.length === 0) {
            console.log('File not found:', fileCode);
            return res.status(404).json({ error: 'No file exists' });
        }

        const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads',
        });

        const readStream = gridfsBucket.openDownloadStream(file._id);
        let buffer = Buffer.from('');

        readStream.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
        });

        readStream.on('end', () => {
            let contentType;

            // Set content type based on file extension or metadata
            if (file.contentType) {
                contentType = file.contentType;
            } else {
                const ext = file.filename.split('.').pop().toLowerCase();
                switch (ext) {
                    case 'jpg':
                    case 'jpeg':
                        contentType = 'image/jpeg';
                        break;
                    case 'png':
                        contentType = 'image/png';
                        break;
                    case 'mp3':
                        contentType = 'audio/mpeg';
                        break;
                    case 'mp4':
                        contentType = 'video/mp4';
                        break;
                    default:
                        contentType = 'application/octet-stream';
                }
            }

            // Send the file as a response with appropriate content type
            res.set('Content-Type', contentType);
            res.send(buffer);
        });

    } catch (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});








module.exports = router;
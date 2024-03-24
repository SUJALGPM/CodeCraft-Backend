const FileModel = require("../Models/FileModel");
const fs = require('fs');



//File Store Controller....
const fileStoreController = async (req, res) => {
    try {
        console.log("File data:", req.file);

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Assuming req.file contains the uploaded file data
        const { originalname, mimetype, buffer, size } = req.file;

        // Check file size limit (16 MB)
        const maxSize = 16 * 1024 * 1024;
        if (size > maxSize) {
            return res.status(400).send('File size is too large. Maximum size allowed is 16 MB.');
        }

        // Create a new File document with binary data
        const file = new FileModel({
            filename: originalname,
            contentType: mimetype,
            size: size,
            data: buffer,
        });

        // Save the file to MongoDB
        await file.save();

        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file.');
    }
};


//File retireve Controller...
const fileRetreiveController = async (req, res) => {
    try {
        // Retrieve file from MongoDB (example: by ID)
        const fileId = req.params.id;
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).send('File not found.');
        }

        // Store retrieved file in "ExtractedFiles" folder
        const filePath = path.join('S:/PROGRAMS/Mern_Stack Projects/Internship Projects  🔐🔐🔐/CodeLinker Porject/server/ExtractedFiles', file.filename);
        fs.writeFileSync(filePath, file.data);

        res.status(200).send('File retrieved and stored successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving and storing file.');
    }
};





module.exports = { fileStoreController, fileRetreiveController }
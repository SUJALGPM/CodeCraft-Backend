const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    accessCode: {
        type: Number,
        required: false
    },
    filename: {
        type: String,
        required: false,
    },
    contentType: {
        type: String,
        required: false,
    },
    encoding: {
        type: String,
        required: false
    },
    mimeType: {
        type: String,
        required: false
    },
    fileSize: {
        type: Number,
        required: false,
    },
    chunkSize: {
        type: Number,
        required: false
    },
    bucketName: {
        type: String,
        required: false,
    },
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;

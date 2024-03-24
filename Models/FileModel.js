const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: false,
    },
    contentType: {
        type: String,
        required: false,
    },
    size: {
        type: Number,
        required: false,
    },
    data: {
        type: Buffer,
        required: false,
    },
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;

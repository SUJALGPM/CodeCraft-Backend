const mongoose = require('mongoose');

//Configure File Schema..
const fileSchema = new mongoose.Schema({
    Code: {
        type: String,
        required: true
    },
    hashedData: {
        type: String,
        required: true
    },
    codeUsage: {
        type: Number,
        required: true,
        default: 0
    },
    Date: {
        type: String,
        default: () => {
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
            const year = currentDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
    },
    Time: {
        type: String,
        default: () => {
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, '0');
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const seconds = currentTime.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    }
});


const fileModel = mongoose.model('securedData', fileSchema);
module.exports = fileModel;
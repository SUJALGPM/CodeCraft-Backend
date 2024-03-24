const dataModel = require('../Models/DataModel');
const crypto = require('crypto-js');


//Post Code controller...
const uploadCodeController = async (req, res) => {
    try {
        const { data } = req.body;

        //Check the data found or not...
        if (!data) {
            return res.status(404).send({ message: "Data not found to encrypt..!!", success: false });
        }

        //Generate random 4-digit number...
        const generateRandomDigits = () => {
            return Math.floor(1000 + Math.random() * 9000).toString();
        }

        //Encrypt data in AES algorithm...
        const enryptedData = await crypto.AES.encrypt(data, process.env.SECRETKEY).toString();
        const digit = generateRandomDigits();

        //Check the digit or cipher data exist or not..
        if (!digit) {
            return res.status(404).send({ message: "4-DIGIT Code not found to encrypt..!!", success: false });
        } else if (!enryptedData) {
            return res.status(404).send({ message: "Cipher data is not found..!!", success: false });
        }

        //Clean data before store..
        const formatedData = {
            Code: digit,
            hashedData: enryptedData
        }

        //Create new document....
        const newCipherData = new dataModel(formatedData);
        await newCipherData.save();

        res.status(201).send({ message: "Encrypted data is successfully store...", data: digit, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to upload the code...", success: false });
    }
}


//Get Code controller...
const getCodeController = async (req, res) => {
    try {
        const code = req.params.code;

        //Check Code found or not...
        if (!code) {
            return res.status(404).send({ message: "Code not found..!!", success: false });
        }

        //Check Data associated with Code exist or not...
        const codeExist = await dataModel.findOne({ Code: code });
        if (!codeExist) {
            return res.status(404).send({ message: "No data found with this Code..!!", success: false });
        }

        //Decrypt Data again in readabel format...
        const decryptedData = await crypto.AES.decrypt(codeExist.hashedData, process.env.SECRETKEY).toString(crypto.enc.Utf8);


        //Check the data decrypted or not...
        if (!decryptedData) {
            return res.status(404).send({ message: "Failed to decrypt data..!!", success: false });
        }

        //Track the data usage...
        codeExist.codeUsage++;


        // Get device information (example using IP address)
        // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // const geo = geoip.lookup(ip);
        // const deviceType = req.headers['user-agent'];

        // console.log("IP :", ip);
        // console.log("Geo :", geo);
        // console.log("DType :", deviceType);


        //Send the response....
        res.status(201).send({ message: "Data Decrypt Successfully...", data: decryptedData, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to fetch the encrypted data..!!", success: false });
    }
}




module.exports = { uploadCodeController, getCodeController }
const express = require("express");
const { uploadCodeController, getCodeController } = require("../Controllers/CodeController");
const router = express.Router();


//Code Upload Routes...
router.post('/code-upload', uploadCodeController);

//Code Get Routes...
router.get('/code-get/:code', getCodeController);


module.exports = router;
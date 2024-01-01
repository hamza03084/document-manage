const express = require("express");
const router = express.Router();
const sendPdfFile = require("./file.controller");
router.get('/',sendPdfFile)

module.exports = router;
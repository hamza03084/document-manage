const express = require("express");
const { loginUser, sendOtp } = require("./auth.controller");
const router = express.Router();
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
module.exports = router;

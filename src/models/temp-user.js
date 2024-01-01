const mongoose = require("mongoose");
const validator = require("validator");

const tempUser = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  otp: {
    type: String,
    required: [true, "otp is required field"],
  },
});
const TempUser = mongoose.model("TempUser", tempUser);
module.exports = TempUser;

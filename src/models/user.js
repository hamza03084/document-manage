const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  surname: {
    type: String,
    required: [true, "Please enter your surname"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
  },

  address_line1: {
    type: String,
  },
  address_line2: {
    type: String,
  },
  city: {
    type: String,
  },
  address_line2: {
    type: String,
  },
  zip_code: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  country: {
    type: String,
  },
  terms: {
    type: Boolean,
    required: [true, "Please accept the terms"],
    validate: {
      validator: value => value === true,
      message: "Please accept the terms",
    },
  },
  disclaimer: {
    type: Boolean,
    required: [true, "Please accept the disclaimer"],
    validate: {
      validator: value => value === true,
      message: "Please accept the disclaimer",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  ppm_code: {
    type: String,
    required: true,
  },
})

const User = mongoose.model("User", userSchema)

module.exports = User

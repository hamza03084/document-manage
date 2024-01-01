const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../utils/catchAsync");
const TempUser = require("../../models/temp-user");
const { generateRandomNumber } = require("../../utils/randomNumber");
const sendEmail = require("../../utils/email");
const AppError = require("../../utils/appError");

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ message: "Login successful", token });
});

const sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  let otp = generateRandomNumber();
  let realUser = await User.findOne({ email });
  if (realUser) {
    return next(new AppError("You are already registered!", 404));
  }
  let existingUser = await TempUser.findOne({ email });

  if (existingUser) {
    existingUser.otp = otp;
    await existingUser.save();
  } else {
    existingUser = await TempUser.create({ email, otp });
  }

  sendEmail({
    email: email,
    subject: "OTP: HyperScale Nexus Registration",
    message: `Your OTP code is: ${otp}`,
  });
  res.status(200).json({ message: "OTP sent successfully!", email });
});

module.exports = { loginUser, sendOtp };

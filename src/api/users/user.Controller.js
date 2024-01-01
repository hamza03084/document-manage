const TempUser = require("../../models/temp-user");
const User = require("../../models/user");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const sendEmail = require("../../utils/email");
const bcrypt = require('bcryptjs');
const { generateFile } = require("../../utils/generate-file");
const {
  generateRandomNumber,
  generateRandomPassword,
} = require("../../utils/randomNumber");

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(201).json(user);
});

const register = catchAsync(async (req, res, next) => {
  const { otp, ...rest } = req.body;
  const { email } = rest;
  const tempUser = await TempUser.findOne({ email });
  const existingUser = await User.findOne({ email });
  if (!tempUser) {
    return next(new AppError("Email not verified!", 404));
  }
  if (existingUser) {
    return next(new AppError("You are already registered!", 404));
  }
  if (tempUser.otp !== otp) {
    return next(new AppError("invalid otp", 400));
  }
  const ppmCode = generateRandomNumber();
  const randomPassword = generateRandomPassword();

  const hashedPassword = await bcrypt.hash(randomPassword, 10);
  const newUser = new User({
    ...rest,
    ppm_code: generateRandomNumber(),
    password: hashedPassword,
  });
  const user = await newUser.save();
  const sendDownloadLink = true;
  if (sendDownloadLink) {
    await generateFile(ppmCode);
    const protocol = req.protocol;
    const host = req.get("host");

    const imgUrl = `${protocol}://${host}/public/images/Hyperscale.jpg`

    const frontend_url =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/downloads/${ppmCode}`
        : `https://tutorpk-admin.vercel.app/downloads/${ppmCode}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Received</title>
      </head>
    
      <body>
        <div>Dear ${rest.name}</div>
        <br />
        <div>I hope this email finds you well.</div>
        <br />
        <div style="font-size: 14px">
          We are delighted to introduce you to HyperScale Nexus! We have created
          unique and exclusive access for yourself to view private documentation to
          see how HyperScale Nexus is poised to enter the market.
        </div>
    
        <br />
        <div>Private Placement Memorandum:</div>
        <div>
          <a href="${frontend_url}">CLICK HERE </a> to download your uniquely
          assigned HyperScale Nexus PPM.
        </div>
        <br />
        <br />
    
        <div>HyperScale Nexus Data Room hyperscalenexus.com/drive</div>
        <div>
          Your personal login details to view further documentation on HyperScale
          Nexus:
        </div>
        <div>Login: ${rest.email}</div>
        <div>Password: ${randomPassword}</div>
    
        <br />
        <div>
          Should you have any questions or require additional information, please do
          not hesitate to contact us at
          <a href="mailto:investor@hyperscalenexus.com"
            >investor@hyperscalenexus.com</a
          >
        </div>
    
        <br />
        <div>
          Thank you for your confidence in HyperScale Nexus. We look forward to
          embarking on this exciting journey with you.
        </div>
    
        <br />
        <div>Best regards,</div>
    
        <br />
        <img src=${imgUrl} alt="hyperScale" />
      </body>
    </html>
    
    `;

    sendEmail({
      email,
      subject: "PPM Download",
      message: htmlContent,
    });
  }

  res.status(201).json(user);
});

const editUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
});

const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});
module.exports = { getUser, editUser, deleteUser, getUserById, register };

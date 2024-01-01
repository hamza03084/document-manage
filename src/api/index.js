const express = require("express");
const router = express.Router();
const users = require("./users");
const auth = require("./auth");
const file = require("./file");
// const { authenticateUser } = require("../middleware/authMiddleware");

router.use("/users", users);
router.use("/auth", auth);
router.use("/pdf", file);

module.exports = router;

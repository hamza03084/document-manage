const express = require("express");
const {
  getUser,
  editUser,
  deleteUser,
  getUserById,
  register,
} = require("./user.Controller");
const router = express.Router();

router.get("/", getUser);
router.get("/:id", getUserById);
router.patch("/:id", editUser);
router.delete("/:id", deleteUser);
router.post("/register", register);

module.exports = router;

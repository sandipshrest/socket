const express = require("express");
const {
  registerNewUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerNewUser);
router.post("/login", loginUser);
router.post("/users", getAllUsers);

module.exports = router;

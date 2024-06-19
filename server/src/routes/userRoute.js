const express = require("express");
const { registerNewUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerNewUser);
module.exports = router;

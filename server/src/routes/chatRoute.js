const express = require("express");
const { getChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/chat", getChat);
// router.post("/login", loginUser);
// router.post("/users", getAllUsers);

module.exports = router;

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
saltRounds = 10;

const registerNewUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(403).json({ msg: "User already exists." });
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashPassword;
      await User.create(req.body);
      res.status(201).json({ msg: "registered successfully!" });
    }
  } catch (err) {
    res.status(400).json({ msg: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const userDetail = await User.findOne({ email: req.body.email });
    if (!userDetail) {
      return res.status(403).json({ msg: "User is not registered!" });
    } else {
      const matched = await bcrypt.compare(
        req.body.password,
        userDetail.password
      );
      if (!matched) {
        return res.status(403).json({ msg: "Password didn't match!" });
      } else {
        return res.status(201).json({ msg: "Login Successfully", userDetail });
      }
    }
  } catch (err) {
    res.status(400).json({ msg: "Registration failed" });
  }
};
module.exports = { registerNewUser, loginUser };
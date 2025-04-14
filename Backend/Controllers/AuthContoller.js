const UserModal = require("../Modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//for sign up
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModal.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist , you can login",
        success: false,
      });
    }
    const userModel = new UserModal({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      message: "signUp Successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//for login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email });
    const errMessage = "Authentication failed, email or password is incorrect";
    if (!user) {
      return res.status(403).json({
        message: errMessage,
        success: false,
      });
    }

    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.status(403).json({ message: errMessage, success: false });
    }
    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "login Successfully",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const privacyAuthPass = async (req, res) => {
  console.log("Checking");
  try {
    const { name, password } = req.body;

    const user = await UserModal.findOne({ name });
    const errMessage = "Authentication failed, password is incorrect";
    if (!user) {
      return res.status(403).json({
        message: errMessage,
        success: false,
      });
    }

    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.status(403).json({ message: errMessage, success: false });
    }
    console.log("user", user);

    res.status(200).json({
      message: "Password is correct",
      success: true,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
module.exports = {
  signup,
  login,
  privacyAuthPass,
};

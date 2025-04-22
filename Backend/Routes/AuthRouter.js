const {
  signup,
  login,
  privacyAuthPass,
  updatePassword,

  userExits,
} = require("../Controllers/AuthContoller");
const ensureAuth = require("../Middleware/Auth");
const {
  singupValidation,
  loginValidation,
} = require("../Middleware/authValidation");

const router = require("express").Router();

router.post("/signup", singupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/privacy-auth", privacyAuthPass);

router.post("/update-password", updatePassword);
router.post("/user-exist", userExits);

module.exports = router;

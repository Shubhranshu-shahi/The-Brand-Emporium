const jwt = require("jsonwebtoken");
const ensureAuth = (req, res, next) => {
  const auth = req.headers["authorization"].split(" ")[1];
  if (!auth) {
    return res.status(403).json({
      message: "JWT token is require",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Aunthozie, JWT token is wrong or expire",
      success: false,
    });
  }
};
module.exports = ensureAuth;

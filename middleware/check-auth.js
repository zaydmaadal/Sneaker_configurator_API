const jwt = require("jsonwebtoken");
const config = require("../config/orderConfig");

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authorization failed, no token found",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], config.passwordToken); // Token splitten
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Authorization failed, wrong token",
    });
  }
};

module.exports = checkAuth;

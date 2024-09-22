const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET_KEY = "VAIBHAVI08051997";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header missing" });
  }

  const token = authHeader;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is required",
    });
  }
  console.log(token); // Log the token for debugging purposes
  jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error(err); // Log the error for debugging purposes
      return res
        .status(403)
        .json({ success: false, message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;

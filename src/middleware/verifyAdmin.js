const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ACCESS_TOKEN_SECRET_KEY = require("../controllers/usercontroller");

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization; // Assuming the token is passed in the request header
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const { userType } = decoded; // Assuming userType is present in the token payload

    if (userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // If the user is an admin, allow access to the route
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyAdmin;

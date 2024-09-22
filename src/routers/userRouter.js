const express = require("express");
const User = require("../models/user");
const multer = require("multer");
const {
  signUp,
  login,
  getAllUsers,
  updateUsers,
  deleteUsers,
  getOneUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/usercontroller");
const verifyToken = require("../middleware/verifyToken");
const router = new express.Router();

//  Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/user"); // Set your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file if needed
  },
});
// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};
// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post("/signUp", upload.single("avatar"), signUp);
router.post("/login", login);
router.get("/users", verifyToken, getAllUsers);
router.patch("/users/:id", verifyToken, upload.single("avatar"), updateUsers);
router.delete("/users/:id", verifyToken, deleteUsers);
router.get("/signUp", verifyToken, getOneUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:id/:token", resetPassword);

module.exports = router;

const express = require("express");
const Movies = require("../models/movies");
const multer = require("multer");
const {
  createMovies,
  getAllMovies,
  getMovies,
  updateMovies,
  deleteMovies,
} = require("../controllers/moviesController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyToken");
const router = new express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/movies"); // Set your upload directory
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

router.post(
  "/movies",
  verifyToken,
  verifyAdmin,
  upload.single("poster"),
  createMovies
);
router.get("/movies", verifyToken, getAllMovies);
router.get("/movies/:id", verifyToken, getMovies);
router.put(
  "/movies/:id",
  verifyToken,
  verifyAdmin,
  upload.single("poster"),
  updateMovies
);
router.delete("/movies/:id", verifyToken, verifyAdmin, deleteMovies);

module.exports = router;

const mongoose = require("mongoose");
const validator = require("validator");

const moviesShcema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    moviename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Movies = new mongoose.model("Movies", moviesShcema);
module.exports = Movies;

const Movies = require("../models/movies");

// create movies
const createMovies = async (req, res) => {
  try {
    const poster = req.file ? req.file.filename : null;
    const { moviename, description, genre, director, year, rating } = req.body;
    // Check for mandatory fields
    if (
      !moviename ||
      !description ||
      !genre ||
      !director ||
      !year ||
      !rating ||
      !req.file
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All fields including poster are mandatory!",
      });
    }

    // Create a new movie record
    const newMovie = await Movies.create({
      moviename,
      description,
      genre,
      director,
      year,
      rating,
      poster,
      user_id: req.user.id,
    });

    res.status(201).json({ status: "success", data: newMovie });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
// get all movies
const getAllMovies = async (req, res) => {
  // console.log("user ::", req.user);
  try {
    // add pagination
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const skip = (page - 1) * limit;
    console.log({ page: page, limit: limit });
    // add search
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");
    const searchquery =
      search !== ""
        ? {
            $or: [
              { moviename: { $regex: regex } },
              { director: { $regex: regex } },
              { genre: { $regex: regex } },
              { year: !isNaN(search) ? parseInt(search) : null },
              { rating: !isNaN(search) ? parseInt(search) : null },
            ],
          }
        : {};
    // add filter
    const filters = {};
    if (req.query.genre) {
      const genres = req.query.genre.split(","); // Assuming genres are passed as comma-separated values
      filters.genre = { $in: genres }; // Use $in operator to match any genre in the array
    }
    // add sorting
    const sortBy = req.query.sortBy || "moviename"; // Default sorting by movie name
    const sortDirection = req.query.sortDirection || "desc"; // Default sorting direction is ascending

    const sortOptions = {};
    sortOptions[sortBy] = sortDirection === "asc" ? 1 : -1;

    const query = {
      $and: [
        searchquery, // Search query
        filters, // Genre filter
        { user_id: req.user.id },
      ],
    };
    // Fetch movies based on the constructed query, sort, skip, and limit
    const movies = await Movies.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total movies for pagination
    const totalSearchmovies = await Movies.countDocuments(query);
    const totalMovies = await Movies.countDocuments();
    res.status(200).json({
      totalMovies,
      data: movies,
      page,
      totalPages: Math.ceil(totalSearchmovies / limit),
      totalSearchmovies,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
    // console.log("error ::", error);
  }
};

// get movies
const getMovies = async (req, res) => {
  try {
    const _id = req.params.id;
    const movies = await Movies.findById({ _id, user_id: req.user.id });
    if (!movies) {
      return res.status(400).json({ status: "fail", error: error.message });
    } else {
      res.status(200).json({
        data: movies,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// update movies

const updateMovies = async (req, res) => {
  try {
    const { moviename, description, genre, director, year, rating } = req.body;
    const _id = req.params.id;

    let poster = null;
    if (req.file) {
      poster = req.file.filename;
    }

    const movies = await Movies.findOneAndUpdate(
      { _id, user_id: req.user.id },
      { moviename, description, genre, director, year, rating, poster },
      { new: true }
    );

    if (!movies) {
      return res
        .status(404)
        .json({ status: "fail", message: "Movie not found" });
    }

    res.status(201).json({ data: movies });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
      message: "Movies not updated",
    });
  }
};

// delete movies
const deleteMovies = async (req, res) => {
  try {
    const _id = req.params.id;
    const movies = await Movies.findByIdAndDelete(_id);
    if (!movies) {
      return res.status(400).json({ status: "fail", error: error.message });
    }
    res.status(200).json({
      status: "success",
      message: "Delete movies successfull...",
      movies,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = {
  createMovies,
  getAllMovies,
  getMovies,
  updateMovies,
  deleteMovies,
};

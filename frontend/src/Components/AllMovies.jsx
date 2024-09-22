import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies } from "../redux/moviesSlice";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { deleteMovies } from "../redux/moviesSlice";
import toast, { Toaster } from "react-hot-toast";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select";

const genreOptions = [
  { label: "Action", value: "Action" },
  { label: "Drama", value: "Drama" },
  { label: "Horror", value: "Horror" },
  { label: "Thriller", value: "Thriller" },
  { label: "Romance", value: "Romance" },
  { label: "Comedy", value: "Comedy" },
  { label: "Documentary", value: "Documentary" },
  { label: "Animation", value: "Animation" },
  { label: "Fiction", value: "Fiction" },
  { label: "Crime", value: "Crime" },
  { label: "Mystery", value: "Mystery" },
  { label: "War", value: "War" },
  { label: "Adventure", value: "Adventure" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Science Fiction", value: "Science Fiction" },
  { label: "Musical", value: "Musical" },
];
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    padding: "0.100rem  0.475rem",
    border: "none",
  }),
};

const AllMovies = () => {
  const { movieslist } = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction is ascending
  const [selectedGenres, setSelectedGenres] = useState([]);
  const sortOptions = [
    { value: "moviename", label: "Movie Name" },
    { value: "year", label: "Year" },
    { value: "rating", label: "Rating" },
  ];

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    // Reset sort direction to ascending when a new option is selected
    setSortDirection("asc");
  };

  const handleSortChange = () => {
    // Toggle sort direction if the same option is selected again
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };
  // get all movies code
  useEffect(() => {
    dispatch(
      getAllMovies({
        page,
        limit,
        search: searchQuery,
        sortBy: selectedSort,
        sortDirection,
        genres: selectedGenres,
      })
    );
  }, [
    dispatch,
    page,
    limit,
    searchQuery,
    selectedSort,
    sortDirection,
    selectedGenres,
  ]);

  if (!movieslist || movieslist.length === 0) {
    return <p>No movies available.</p>;
  }
  // delete movies code
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMovies(id));
      toast.success("Movie deleted successfully...........");
      // Refresh movies after deletion
      dispatch(
        getAllMovies({
          page,
          limit,
          search: searchQuery,
          sortBy: selectedSort,
          sortDirection,
        })
      );
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  // filter functionlity code
  const handlefilter = () => {
    dispatch(
      getAllMovies({
        page,
        limit,
        search: searchQuery,
        sortBy: selectedSort,
        sortDirection,
        genres: selectedGenres,
      })
    );
  };

  console.log(movieslist);

  return (
    <div className="container py-11">
      <div className="w-11/12	  ">
        <Toaster />
        <div className="flex justify-between items-center flex-col md:flex-row ">
          <div className=" flex gap-4 items-center mb-4 ">
            <form>
              <div className="search flex relative items-center">
                <input
                  type="text"
                  name="searchQuery"
                  value={searchQuery}
                  id="searchQuery"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search...."
                  className="block w-full rounded-md border-3 border-black py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button className="absolute top-3-5 right-3">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className=" flex items-center mb-4  w-full rounded-md border-3 border-slate-950 py-1 px-1  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <select
                id="sortSelect"
                value={selectedSort}
                onChange={handleSelectChange}
                className="block w-full rounded-md border-0  py-[0.8rem] px-[0.475rem] text-gray-900  placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Sort By:</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="buttonStyle1" onClick={handleSortChange}>
                {sortDirection === "desc" ? "Desc" : "Asc"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className=" flex items-center mb-4  w-full rounded-md border-3 border-slate-950 py-1 px-1  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <Select
                value={genreOptions.filter((option) =>
                  selectedGenres.includes(option.value)
                )}
                onChange={handleGenreChange}
                options={genreOptions}
                isMulti={true}
                name="genre"
                styles={customStyles}
              />
              <button className="buttonStyle1" onClick={handlefilter}>
                Filter
              </button>
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-center">All Movies</h2>

        <div>
          <div className="flex justify-center items-center overflow-auto">
            <table className="table-auto w-1/2">
              <thead className="text-xs uppercase  bg-gray-600 text-white ">
                <tr className="border-2 border-solid border-l-0 border-r-0 ">
                  <th className="py-3  px-6">No.</th>
                  <th className="py-3  px-6">Movie name</th>
                  <th className="py-3  px-6">Poster</th>
                  <th className="py-3  px-6">Genre</th>
                  <th className="py-3  px-6">Director</th>
                  <th className="py-3  px-6">Year</th>
                  <th className="py-3  px-6">Rating</th>
                  <th className="py-3  px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {movieslist?.data?.map((item, index) => {
                  const {
                    _id,
                    moviename,
                    poster,
                    genre,
                    director,
                    year,
                    rating,
                  } = item;
                  return (
                    <tr
                      key={_id}
                      className="odd:bg-white  even:bg-gray-600 even:text-white text-center"
                    >
                      <td className="py-4 px-5">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="py-4 px-5">{moviename}</td>
                      <td className="py-4 px-5">
                        <div className="flex justify-center items-center">
                          {poster ? (
                            <img
                              src={`http://localhost:8080/api/movies/upload/${poster}`}
                              alt="movies"
                              className="w-full	"
                            />
                          ) : (
                            <p>No poster available</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">{`${genre}`}</td>
                      <td className="py-4 px-5"> {director}</td>
                      <td className="py-4 px-5">{year}</td>
                      <td className="py-4 px-5">{rating}</td>
                      <td className="py-4 px-5 ">
                        <div className="flex justify-evenly items-center text-2xl">
                          <button
                            onClick={() =>
                              navigate(`/update-movies/${_id}`, { state: item })
                            }
                          >
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(_id)}>
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* pagination code */}
          <div className="flex justify-center items-center mt-9">
            <div className="flex justify-start gap-2 items-center p-2 w-fit text-black">
              <button
                onClick={() => setpage(page - 1)}
                disabled={page === 1}
                className="hover:bg-slate-300 disabled:bg-transparent px-2 py-1 disabled:text-slate-600"
              >
                <FaAngleDoubleLeft />
              </button>
              {page === movieslist?.totalPages &&
                movieslist?.totalPages !== 1 && (
                  <button
                    onClick={() => setpage(page - 2)}
                    className="hover:bg-slate-300 px-2 py-1"
                  >
                    {page - 2}
                  </button>
                )}
              {page !== 1 && (
                <button
                  onClick={() => setpage(page - 1)}
                  disabled={page === 1}
                  className="hover:bg-slate-300 px-2 py-1"
                >
                  {page - 1}
                </button>
              )}
              <button
                onClick={() => setpage(page)}
                className={`${
                  page === movieslist?.page ? "bg-slate-300" : ""
                } hover:bg-slate-300 px-2 py-1`}
              >
                {page}
              </button>
              {page !== movieslist?.totalPages && (
                <button
                  onClick={() => setpage(page + 1)}
                  disabled={page === movieslist?.totalPages}
                  className="hover:bg-slate-300 px-2 py-1"
                >
                  {page + 1}
                </button>
              )}
              {page === 1 && movieslist?.totalPages !== 1 && (
                <button
                  onClick={() => setpage(page + 2)}
                  className="hover:bg-slate-300 px-2 py-1"
                >
                  {page + 2}
                </button>
              )}
              <button
                onClick={() => setpage(page + 1)}
                disabled={movieslist?.page === movieslist?.totalPages}
                className="hover:bg-slate-300 px-2 py-1 disabled:text-slate-600"
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMovies;

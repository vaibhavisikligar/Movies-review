import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies } from "../redux/moviesSlice";
const Dashboard = () => {
  const { movieslist } = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(getAllMovies({ page, limit, search: searchQuery }));
  }, [dispatch, page, limit, searchQuery]);

  return (
    <div className="container py-6">
      <div className="w-4/12 py-8">
        <div className="block max-w-sm p-6 text-white  border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h3>Total Movies: {movieslist.totalMovies}</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

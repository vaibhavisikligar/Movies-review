import { createSlice } from "@reduxjs/toolkit";
// create movies
export const createMovies = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const response = await fetch("http://localhost:8080/api/movies", {
      method: "POST",
      headers: {
        authorization: token,
        // Remove 'Content-Type' for FormData as it's set automatically
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating movie:", error);
  }
};
// get all movies
export const getAllMovies =
  ({ page, limit, search, sortBy, sortDirection, genres }) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const genresToJoin = Array.isArray(genres) ? genres : []; // Ensure genres is an array
      const response = await fetch(
        `http://localhost:8080/api/movies?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortDirection=${sortDirection}&genre=${genresToJoin.join(
          ","
        )}`,
        {
          method: "GET",
          headers: {
            authorization: token,
          },
        }
      );
      const data = await response.json();
      dispatch(setMovies(data));
      return data;
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

export const updateMovies =
  ({ id, formData }) =>
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "PUT",
        headers: {
          authorization: token,
        },
        body: formData, // Pass formData directly without JSON.stringify
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  };
export const deleteMovies = (id) => async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
      method: "DELETE",
      headers: {
        authorization: token,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};


const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movieslist: [],
  },
  reducers: {
    setMovies: (state, action) => {
      state.movieslist = action.payload;
    },
  },
});
export const { setMovies } = moviesSlice.actions;
export default moviesSlice.reducer;

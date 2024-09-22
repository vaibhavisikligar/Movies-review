import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../redux/loginSlice";
import signupSlice from "../redux/signupSlice";
import moviesSlice from "../redux/moviesSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    signup: signupSlice,
    movies: moviesSlice,
  },
});
export default store;

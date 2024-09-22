import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./commanComponents/AdminLayout";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AddMovies from "./Components/AddMovies";
import AllMovies from "./Components/AllMovies";
import PrivateRoute from "./commanComponents/PrivateRoute";
import Editprofile from "./Components/Editprofile";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-movie"
              element={
                <PrivateRoute>
                  <AddMovies />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-movies"
              element={
                <PrivateRoute>
                  <AllMovies />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-movies/:id"
              element={
                <PrivateRoute>
                  <AddMovies />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-user"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <Editprofile />
                </PrivateRoute>
              }
            />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </>
  );
}

export default App;

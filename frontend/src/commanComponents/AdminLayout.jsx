import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);

  // Check if the user is logged in
  const isLoggedIn = !!token;
  const protectedPaths = [
    "/",
    "/dashboard",
    "/add-movie",
    "/all-movies",
    "/all-user",
    `/update-movies/${location.pathname.split("/")[2]}`,
    "/edit-profile",
  ];
  return (
    <>
      <div className="flex flex-row h-screen w-screen">
        {isLoggedIn && protectedPaths.includes(location.pathname) && (
          <>
            <div
              className={`md:flex w-60 bg-gray-600 text-white p-3 ${
                show ? "flex absolute top-0 left-0 h-screen z-10" : "hidden"
              }`}
            >
              <Sidebar onClose={() => setShow(false)} />
            </div>
            <div className="lg:w-[90%] w-full bg-gray-700  h-20 p-6">
              <div className="flex justify-between items-center">
                <IoMdMenu
                  className="text-3xl md:hidden block"
                  onClick={() => setShow(true)}
                />
                <Header />
              </div>

              {children}
            </div>
          </>
        )}
        {!isLoggedIn && children}
        {/* Render children (e.g., login/signup) if not logged in */}
      </div>
    </>
  );
};

export default AdminLayout;

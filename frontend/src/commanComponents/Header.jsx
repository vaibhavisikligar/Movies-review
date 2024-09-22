import React, { useEffect, useState } from "react";
import { setUser } from "../redux/loginSlice";
import adminProfile from "../img/adminProfile.png";
import { FaSortDown, FaSortUp, FaRegUser, FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { userlist } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userlist");
    navigate("/login");
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/signUp", {
        method: "GET",
        headers: {
          authorization: token,
        },
      });
      const data = await response.json();
      // console.log("data::", data);
      dispatch(setUser(data.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [isdropOpen, setIsDropOpen] = useState(false);

  useEffect(() => {
    // Check token expiration here
    const token = localStorage.getItem("token");
    // Example: Check if the token exists and if it's expired (You might need a more specific token validation method)
    const isTokenExpired = !token; // Modify this line based on your actual token validation logic

    if (isTokenExpired) {
      // Token expired, initiate logout
      logout();
    }
  }, []);
  return (
    <header>
      <div className="user-profile flex items-center gap-4 ">
        <div className="user-profile-img w-10 h-10 rounded-full border-white border-2 flex justify-center items-center object-cover">
          {userlist && userlist.avatar ? (
            <img
              src={`http://localhost:8080/api/signUp/upload/${userlist.avatar}`}
              alt="adminprofile"
              className="bg-white w-full h-full rounded-full border-white border-2 "
            />
          ) : (
            <img
              src={adminProfile}
              alt="adminprofile"
              className="bg-white w-full h-full rounded-full border-white border-2 "
            />
          )}
        </div>
        <div className="relative flex flex-col items-center w-[135px] ">
          <button
            onClick={() => setIsDropOpen((prev) => !prev)}
            className="text-gray-900 p-2 w-full flex items-center justify-between bg-white rounded-lg font-bold text-md"
          >
            {userlist.firstname}
            {!isdropOpen ? <FaSortDown /> : <FaSortUp />}
          </button>
          {isdropOpen && (
            <div className="bg-gray-700 text-white absolute z-10 top-14 rounded-lg p-2 w-full">
              <ul>
                <li>
                  <Link
                    className="nav-link w-100 flex items-center justify-start gap-3 py-2"
                    to={"/edit-profile"}
                    onClick={() => setIsDropOpen(false)}
                  >
                    <FaRegEdit /> Edit profile
                  </Link>
                </li>
                <li>
                  <button
                    className="nav-link w-100 flex items-center justify-start gap-3 py-2"
                    onClick={() => logout()}
                  >
                    <RiLogoutCircleRLine /> Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

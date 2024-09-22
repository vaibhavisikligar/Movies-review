import React from "react";
import { navlinks } from "../utilis/Navlinks";
import logo from "../img/logo.png";
import { NavLink } from "react-router-dom";
const Sidebar = ({ onClose }) => {
  return (
    <>
      <div className=" p-3 relative">
        <div className="absolute top-0 right-2 md:hidden" onClick={onClose}>
          *
        </div>
        <div className="logo flex justify-center items-center">
          <img src={logo} alt="movies-review" className="w-1/2" />
        </div>
        {navlinks.map((item) => {
          const { id, title, link, icon } = item;
          return (
            <ul key={id} className="py-3 px-8 flex  items-center">
              <li>
                <NavLink
                  className="nav-link w-100 flex items-center justify-center gap-3"
                  to={link}
                >
                  {icon} {title}
                </NavLink>
              </li>
            </ul>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;

import { RiDashboardLine, RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { PiUserListFill } from "react-icons/pi";


export const navlinks = [
  {
    id: 1,
    title: "Dashboard",
    link: "/dashboard",
    icon: <RiDashboardLine />,
  },
  {
    id: 2,
    title: " Add Movice",
    link: "/add-movie",
    icon: <IoMdAddCircleOutline />,
  },
  {
    id: 3,
    title: " All Movies",
    link: "/all-movies",
    icon: <FaList />,
  },
  {
    id: 4,
    title: " All User",
    link: "/all-user",
    icon: <PiUserListFill />,
  },
];

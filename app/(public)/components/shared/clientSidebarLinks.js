import {
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineScale,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi";

export const clientLinks = [
  {
    name: "Overview",
    href: "/client/dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "Saved",
    href: "/client/dashboard/saved-properties",
    icon: HiOutlineHeart,
    badge: 12,
  },
  {
    name: "Contacted",
    href: "/client/dashboard/contacted",
    icon: HiOutlinePhone,
    badge: 3,
  },
  // {
  //   name: "Profile",
  //   href: "/client/dashboard/profile",
  //   icon: HiOutlineUser,
  // },
];
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlinePlusCircle,
  HiOutlineChartBar,
  HiOutlineCash,
  HiOutlineChatAlt2,
  HiOutlineUser,
} from "react-icons/hi";

export const propertyOwnerLinks = [
  {
    name: "Overview",
    href: "/propertyowner/dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "Manage Property",
    href: "/propertyowner/dashboard/manage-property",
    icon: HiOutlineOfficeBuilding,
  },
  {
    name: "Add Property",
    href: "/propertyowner/dashboard/add-property",
    icon: HiOutlinePlusCircle,
  },

  {
    name: "Inquiries",
    href: "/propertyowner/dashboard/inquiries",
    icon: HiOutlineChatAlt2,
    badge: 5,
  },

];
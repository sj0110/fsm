import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, Briefcase, Calendar, Users } from "lucide-react"; // Icons

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarItems {
  [key: string]: MenuItem[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems: SidebarItems = {
    customer: [
      { label: "All Services", path: "/services", icon: <Briefcase className="w-5 h-5" /> },
      { label: "My Bookings", path: "/bookings", icon: <Calendar className="w-5 h-5" /> },
    ],
    serviceProvider: [
      { label: "My Services", path: "/services", icon: <Briefcase className="w-5 h-5" /> },
      { label: "Manage Bookings", path: "/bookings", icon: <Calendar className="w-5 h-5" /> },
    ],
    admin: [
      { label: "Manage Services", path: "/services", icon: <Briefcase className="w-5 h-5" /> },
      { label: "Manage Bookings", path: "/bookings", icon: <Calendar className="w-5 h-5" /> },
      { label: "Manage Users", path: "/users", icon: <Users className="w-5 h-5" /> },
    ],
  };

  const items = user ? sidebarItems[user.role] || [] : [];

  return (
    <div className="relative bg-gray-800">
      {/* Mobile Navbar (Hamburger Menu) */}
      <div className="w-full bg-gray-800 text-white h-14 p-4 md:hidden flex items-center justify-between z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="z-50 pt-8 pl-8 text-white rounded-md relative"
        >
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out">
            {isSidebarOpen ? (
              <X className="h-6 w-6 scale-100 opacity-100 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 scale-100 opacity-100 transition-transform duration-300" />
            )}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-gray-800 text-white p-6 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 h-full
        ${isSidebarOpen ? "translate-x-0 w-full bg-opacity-95" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-6 mt-12 md:mt-0">
          <Briefcase className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 w-full p-3 rounded-md transition-colors ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No navigation items</p>
          )}
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-md transition-colors hover:bg-red-600 bg-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop (Click outside to close sidebar)
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )} */}
    </div>
  );
};

export default Sidebar;

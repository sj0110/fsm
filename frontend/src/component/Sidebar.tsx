import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';


interface MenuItem {
  label: string;
  path: string;
}

interface SidebarItems {
  [key: string]: MenuItem[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // console.log(user);

  const sidebarItems: SidebarItems = {
    customer: [
      { label: 'All Services', path: '/services' },
      { label: 'My Bookings', path: '/bookings' }
    ],
    serviceProvider: [
      { label: 'My Services', path: '/services' },
      { label: 'Manage Bookings', path: '/bookings' }
    ],
    admin: [
      { label: 'Manage Services', path: '/services' },
      { label: 'Manage Bookings', path: '/bookings' },
      { label: 'Manage Users', path: '/users' }
    ]
  };

  const items = user ? sidebarItems[user.role] || [] : []; // Conditional rendering based on user role.

  return (
    <div className="relative">
      {/* Navbar for Mobile (Hamburger Menu) */}
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
        className={`fixed inset-0 z-40 bg-gray-800 text-white p-6 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 
        ${isSidebarOpen ? "translate-x-0 w-full bg-opacity-95" : "-translate-x-full"}`}
      >
        {/* Navigation Items */}
        <div className="space-y-4 mt-10">
          {items.length > 0 ? (
            items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center w-full p-3 rounded-md transition-colors ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.label}
              </NavLink>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No navigation items</p>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full p-3 rounded-md transition-colors hover:bg-red-600 bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Backdrop (Click outside to close sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
}

interface SidebarItems {
  [key: string]: MenuItem[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  // console.log(user);
  const navigate = useNavigate();

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

  const items = user ? sidebarItems[user.role] || [] : [];

  return (
    <div className="w-64 min-h-screen p-4 bg-gray-800">
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full p-2 text-left text-white rounded hover:bg-gray-700"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={logout}
          className="w-full p-2 text-left text-white rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
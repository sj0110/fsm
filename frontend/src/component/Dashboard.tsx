// src/components/Dashboard.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Services from '../pages/Services';
import Bookings from '../pages/Bookings';
import Users from '../pages/Users';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Routes>
          {/* Common Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/bookings" element={<Bookings />} />
          
          {/* Admin Only Routes */}
          {user.role === 'admin' && (
            <Route path="/users" element={<Users />} />
          )}
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/services" replace />} />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/services" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
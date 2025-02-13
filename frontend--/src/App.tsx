import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginScreen from './component/LoginScreen';
import Dashboard from './component/Dashboard';

const App: React.FC = () => {
  const { user } = useAuth();
  // console.log(user);

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? <Dashboard /> : <LoginScreen />}
    </div>
  );
};

export default App;
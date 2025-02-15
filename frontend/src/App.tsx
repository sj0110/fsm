import React from "react";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./component/LoginScreen";
import Dashboard from "./component/Dashboard";
import "./toastStyles.css";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="bottom-right" // Better placement for small screens
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
      />
      {user ? <Dashboard /> : <LoginScreen />}
    </div>
  );
};

export default App;

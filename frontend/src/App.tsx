import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginScreen from './component/LoginScreen';
import Dashboard from './component/Dashboard';
import './toastStyles.css';
import { ToastContainer, toast } from 'react-toastify';


const App: React.FC = () => {
  const { user } = useAuth();

  // console.log(user);
  // const notify = () => {
  //   toast.success("Hurray!");
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <button onClick={notify}>Show Toast</button> */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {user ? <Dashboard /> : <LoginScreen />}
    </div>
  );
};

export default App;
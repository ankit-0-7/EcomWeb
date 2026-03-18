import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-heritage-bg flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-heritage-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is no user logged in, kick them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the requested page
  return children;
};

export default ProtectedRoute;
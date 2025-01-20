import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Or your own auth logic

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { authState } = useAuth();
    console.log("Auth state:", authState);
  if (authState === null) {
    // Show loading or wait until session check completes
    return <div>Loading...</div>;
  }

  if (!authState.isLoggedIn) {
    console.log("Not logged in, redirecting to login page");
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;

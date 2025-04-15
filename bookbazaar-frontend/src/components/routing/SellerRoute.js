import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const SellerRoute = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated && user && user.role === 'seller' ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default SellerRoute;
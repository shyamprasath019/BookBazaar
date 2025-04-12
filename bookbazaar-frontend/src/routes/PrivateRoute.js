import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../api/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.accountType)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;
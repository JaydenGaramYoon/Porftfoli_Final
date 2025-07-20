import React from 'react';
import { Navigate } from 'react-router-dom';
import auth from './auth-helper';

const AdminRoute = ({ children }) => {
  const isAuthenticated = auth.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  if (!isAuthenticated.user.admin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;

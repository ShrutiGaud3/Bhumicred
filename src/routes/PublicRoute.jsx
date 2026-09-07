import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../constants/roles.js';

export const PublicRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN_STAFF) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === ROLES.GOVERNMENT) {
      return <Navigate to="/government/dashboard" replace />;
    }
    if (user.role === ROLES.PARTNER) {
      return <Navigate to="/partner/dashboard" replace />;
    }
    return <Navigate to="/farmer/dashboard" replace />;
  }

  return <Outlet />;
};

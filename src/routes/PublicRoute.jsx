import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../constants/roles.js';

export const PublicRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Always permit pending verification, query correction, and session-expired pages to render in AuthLayout
  const isPendingAuthRoute =
    location.pathname.startsWith('/verification-pending') ||
    location.pathname.startsWith('/query-correction') ||
    location.pathname.startsWith('/session-expired');

  if (isPendingAuthRoute) {
    return <Outlet />;
  }

  if (isAuthenticated && user) {
    // If pending approval, keep them on verification pending page
    if (user.status === 'PENDING_APPROVAL' || user.status === 'PENDING_VERIFICATION') {
      return <Navigate to="/verification-pending" replace />;
    }

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

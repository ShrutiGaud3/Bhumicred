import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PermissionDenied } from '../components/states/PermissionDenied.jsx';
import { ROLES } from '../constants/roles.js';

export const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin has universal access
  if (user.role === ROLES.SUPER_ADMIN) {
    return <Outlet />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <PermissionDenied
        userRole={user.role}
        requiredRole={allowedRoles.join(' / ')}
        message={`This section requires '${allowedRoles.join(' or ')}' credentials. Your current active role is '${user.role}'.`}
      />
    );
  }

  return <Outlet />;
};

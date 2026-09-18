import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PermissionDenied } from '../components/states/PermissionDenied.jsx';
import { PendingApproval } from '../components/states/PendingApproval.jsx';
import { ROLES, ROLE_LABELS } from '../constants/roles.js';

export const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin and Admin Staff have universal administrative access
  if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN_STAFF) {
    return <Outlet />;
  }

  // If user registration is pending approval/verification, lock all dashboard tasks
  const isApproved = user.status === 'APPROVED' || user.status === 'ACTIVE';
  if (!isApproved) {
    const rawId = user?.applicationId || user?._id || user?.id || '883921';
    const cleanId = String(rawId).replace(/\D/g, '').slice(-6) || '883921';
    const displayAppId = user?.applicationId || `BC-APP-${cleanId}`;

    return (
      <div className="py-4 sm:py-8 max-w-4xl mx-auto">
        <PendingApproval
          roleTitle={ROLE_LABELS[user.role] || `${user.role} Onboarding Profile`}
          applicationId={displayAppId}
          submittedAt={user?.submittedAt ? new Date(user.submittedAt).toLocaleDateString('en-IN') : 'Recently Submitted'}
        />
      </div>
    );
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

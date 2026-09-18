import React from 'react';
import { useSelector } from 'react-redux';
import { PendingApproval } from '../../../components/states/PendingApproval.jsx';
import { ROLE_LABELS } from '../../../constants/roles.js';

export const VerificationPendingPage = () => {
  const { user } = useSelector((state) => state.auth);

  const rawId = user?.applicationId || user?._id || user?.id || '883921';
  const cleanId = String(rawId).replace(/\D/g, '').slice(-6) || '883921';
  const displayAppId = user?.applicationId || `BC-APP-${cleanId}`;

  return (
    <div className="py-4 sm:py-8">
      <PendingApproval
        roleTitle={ROLE_LABELS[user?.role] || 'Account Onboarding Profile'}
        applicationId={displayAppId}
        submittedAt={user?.submittedAt ? new Date(user.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently Submitted'}
      />
    </div>
  );
};

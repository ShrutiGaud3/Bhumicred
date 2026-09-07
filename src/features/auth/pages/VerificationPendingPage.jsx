import React from 'react';
import { useSelector } from 'react-redux';
import { PendingApproval } from '../../../components/states/PendingApproval.jsx';
import { ROLE_LABELS } from '../../../constants/roles.js';

export const VerificationPendingPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="py-8">
      <PendingApproval
        roleTitle={ROLE_LABELS[user?.role] || 'Account Onboarding'}
        applicationId={`BC-APP-${user?._id?.toString().slice(-6).toUpperCase() || '883921'}`}
        submittedAt="Recently Submitted"
      />
    </div>
  );
};

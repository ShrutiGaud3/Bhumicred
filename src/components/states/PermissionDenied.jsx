import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

export const PermissionDenied = ({
  requiredRole,
  userRole,
  message = 'You do not have permission to view or manage this section.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 mb-6 text-left">
          <div><span className="font-semibold text-slate-700">Your Active Role:</span> {userRole || 'Standard User'}</div>
          {requiredRole && <div><span className="font-semibold text-slate-700">Required Role:</span> {requiredRole}</div>}
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex-1" icon={ArrowLeft}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} variant="primary" className="flex-1">
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

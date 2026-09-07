import React from 'react';
import { Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useNavigate } from 'react-router-dom';

export const PendingApproval = ({
  roleTitle = 'Onboarding Profile',
  submittedAt,
  applicationId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-3xl border border-amber-200/80 shadow-xl text-center">
      <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse">
        <Clock className="w-8 h-8" />
      </div>
      <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
        Verification In Progress
      </span>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{roleTitle} Under Review</h2>
      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
        Your verification documents have been submitted to the BHUMICRED administrative review desk. Verification typically takes 24–48 business hours.
      </p>

      {applicationId && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 text-left space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Application Reference:</span>
            <span className="font-mono text-emerald-800 font-bold">{applicationId}</span>
          </div>
          {submittedAt && (
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Submitted Date:</span>
              <span>{submittedAt}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Reviewing Authority:</span>
            <span>BHUMICRED Operations Desk</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => window.location.reload()} variant="outline">
          Check Status
        </Button>
        <Button onClick={() => navigate('/support')} variant="primary">
          Contact Support
        </Button>
      </div>
    </div>
  );
};

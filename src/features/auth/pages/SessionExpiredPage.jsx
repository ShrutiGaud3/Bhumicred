import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';

export const SessionExpiredPage = () => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
        <Clock className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Session Expired</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Your secure authentication session has timed out due to inactivity. Please verify your mobile number again to continue.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/login">
          <Button variant="primary" size="lg" className="w-full" icon={LogIn}>
            Re-Authenticate Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

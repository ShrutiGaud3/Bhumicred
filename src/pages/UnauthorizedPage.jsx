import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Unauthorized Access</h1>
        <p className="text-xs text-slate-600 mb-6">
          You do not have the required administrative or role-level permissions to access this feature.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" icon={ArrowLeft}>
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

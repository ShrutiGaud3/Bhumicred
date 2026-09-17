import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-8">
          The agricultural or portal resource you requested does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

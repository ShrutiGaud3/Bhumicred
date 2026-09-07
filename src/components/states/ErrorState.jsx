import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected server error occurred. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 bg-rose-50/50 rounded-2xl border border-rose-200 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" icon={RotateCcw}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

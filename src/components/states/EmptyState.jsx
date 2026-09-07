import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
  icon: Icon = PackageOpen,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

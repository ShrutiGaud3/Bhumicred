import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const types = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-rose-800 text-white border-rose-700',
    info: 'bg-slate-900 text-white border-slate-800',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const IconComponent = icons[type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${types[type] || types.info}`}
      >
        <IconComponent className="w-5 h-5 text-current flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

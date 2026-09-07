import React from 'react';

export const LoadingSkeleton = ({ variant = 'cards', count = 3, className = '' }) => {
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="h-4 bg-slate-200 rounded flex-1"></div>
              <div className="h-4 bg-slate-200 rounded flex-1"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
      <div className="h-32 bg-slate-200 rounded-2xl"></div>
    </div>
  );
};

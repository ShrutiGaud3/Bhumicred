import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-neutral-700 font-semibold',
    primary: 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/70 font-semibold',
    success: 'bg-green-50 dark:bg-emerald-950/90 text-green-800 dark:text-emerald-300 border-green-300 dark:border-emerald-600/70 font-semibold',
    warning: 'bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-600/70 font-semibold',
    danger: 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-600/70 font-semibold',
    info: 'bg-sky-50 dark:bg-sky-950/90 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-600/70 font-semibold',
    purple: 'bg-purple-50 dark:bg-purple-950/90 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-600/70 font-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {children}
    </span>
  );
};

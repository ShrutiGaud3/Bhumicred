import React from 'react';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-slate-900 dark:text-white rounded-2xl shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-700 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`p-5 md:p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-4 ${className}`}>
    <div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 md:p-6 text-slate-900 dark:text-white ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 bg-slate-50/50 dark:bg-neutral-900/50 border-t border-slate-100 dark:border-neutral-800 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

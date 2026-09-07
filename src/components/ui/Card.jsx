import React from 'react';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`p-5 md:p-6 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
    <div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 md:p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

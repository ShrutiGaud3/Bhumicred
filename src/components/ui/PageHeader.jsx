import React from 'react';
import { Breadcrumb } from '../common/Breadcrumb.jsx';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  breadcrumbs = [],
  action,
  actions,
  className = '',
}) => {
  const actionContent = actions || action;

  return (
    <div className={`mb-6 space-y-2 ${className}`}>
      {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">{subtitle}</p>
          )}
        </div>
        {actionContent && <div className="flex items-center gap-2 flex-wrap flex-shrink-0">{actionContent}</div>}
      </div>
    </div>
  );
};

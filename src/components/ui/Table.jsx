import React from 'react';

export const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 dark:divide-neutral-800 text-left text-sm">
        <thead className="bg-slate-50/80 dark:bg-neutral-800/80">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '', onClick }) => (
  <tr
    onClick={onClick}
    className={`hover:bg-slate-50/70 dark:hover:bg-neutral-800/60 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-slate-700 dark:text-neutral-200 ${className}`}>{children}</td>
);

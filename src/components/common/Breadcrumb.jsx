import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 py-3 mb-4">
      <Link to="/" className="hover:text-emerald-700 flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {item.path ? (
            <Link to={item.path} className="hover:text-emerald-700 font-medium truncate max-w-[150px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-semibold truncate max-w-[150px]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

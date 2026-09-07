import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export const Timeline = ({ items = [] }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {items.map((item, idx) => (
        <div key={idx} className="relative group">
          <div
            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
              item.completed ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}
          >
            {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
              {item.timestamp && <span className="text-xs text-slate-400">{item.timestamp}</span>}
            </div>
            {item.description && <p className="text-xs text-slate-600 mt-1">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

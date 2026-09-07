import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ShieldAlert,
  FlaskConical,
  Landmark,
  Users,
  FolderKanban,
  FileText,
  ArrowRight,
  Zap,
} from 'lucide-react';

const iconMap = {
  MapPin,
  ShieldAlert,
  FlaskConical,
  Landmark,
  Users,
  FolderKanban,
  FileText,
};

export const QuickActionCards = ({ actions = [], onActionClick }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-2.5 my-4">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span>Direct Actions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {actions.map((act, idx) => {
          const Icon = iconMap[act.icon] || FolderKanban;
          return (
            <Link
              key={idx}
              to={act.path}
              onClick={onActionClick}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 shadow-sm transition-all group flex items-start justify-between gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                      {act.title}
                    </h4>
                    {act.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{act.description}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

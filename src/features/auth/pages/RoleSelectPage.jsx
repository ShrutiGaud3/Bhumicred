import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedRole } from '../authSlice.js';
import { Leaf, Building2, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { ROLES } from '../../../constants/roles.js';

export const RoleSelectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectRole = (role) => {
    dispatch(setSelectedRole(role));
    navigate(`/login?role=${role}`);
  };

  const roleCards = [
    {
      role: ROLES.FARMER,
      title: 'Farmer / Land Owner',
      description: 'Register and verify farm land, obtain tree & plantation insurance, book soil laboratory testing, and access government subsidy schemes.',
      icon: Leaf,
      badge: 'Citizen Portal',
      colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-500',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      role: ROLES.GOVERNMENT,
      title: 'Government Body',
      description: 'For Gram Panchayats, Nagar Palikas, Nagar Nigams, and Vidhan Sabha authorities to manage public green assets and mobilize farmer campaigns.',
      icon: Building2,
      badge: 'Institutional Desk',
      colorClass: 'bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-500',
      iconBg: 'bg-teal-700 text-white',
    },
    {
      role: ROLES.PARTNER,
      title: 'Enterprise Partner',
      description: 'Authorized field inspection partners, soil laboratories, survey teams, and project execution specialists.',
      icon: Users,
      badge: 'Operations Desk',
      colorClass: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-500',
      iconBg: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Select Your Portal Role
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Choose the role that best matches your organization or identity on BHUMICRED
        </p>
      </div>

      <div className="space-y-3.5">
        {roleCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.role}
              onClick={() => handleSelectRole(item.role)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 hover:shadow-md ${item.colorClass}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${item.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <Link
          to="/register"
          className="font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          First-time User? Register Here
        </Link>
        <button
          onClick={() => handleSelectRole(ROLES.SUPER_ADMIN)}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-800 underline"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

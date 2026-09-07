import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  MapPin,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Building2,
  FolderKanban,
  Users,
} from 'lucide-react';
import { ROLES } from '../../constants/roles.js';

export const MobileBottomNav = ({ onOpenAi }) => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || ROLES.FARMER;

  const farmerLinks = [
    { label: 'Home', path: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'Lands', path: '/farmer/lands', icon: MapPin },
    { label: 'Insurance', path: '/farmer/insurance', icon: ShieldAlert },
    { label: 'Market', path: '/marketplace', icon: ShoppingBag },
  ];

  const govtLinks = [
    { label: 'Home', path: '/government/dashboard', icon: LayoutDashboard },
    { label: 'Assets', path: '/government/assets', icon: MapPin },
    { label: 'Farmers', path: '/government/farmers', icon: Users },
    { label: 'Drives', path: '/government/campaigns', icon: Building2 },
  ];

  const partnerLinks = [
    { label: 'Home', path: '/partner/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/partner/tasks', icon: FolderKanban },
    { label: 'Visits', path: '/partner/visits', icon: MapPin },
    { label: 'Reports', path: '/partner/reports', icon: LayoutDashboard },
  ];

  const adminLinks = [
    { label: 'Admin', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Approvals', path: '/admin/approvals', icon: Users },
    { label: 'Lands', path: '/admin/lands', icon: MapPin },
    { label: 'Audits', path: '/admin/audit', icon: FolderKanban },
  ];

  let links = farmerLinks;
  if (role === ROLES.GOVERNMENT) links = govtLinks;
  if (role === ROLES.PARTNER) links = partnerLinks;
  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN_STAFF) links = adminLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-2xl">
      {links.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}

      {/* Center AI Trigger */}
      <button
        onClick={onOpenAi}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-emerald-800 hover:text-emerald-950 font-bold"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </div>
        <span className="text-[10px] tracking-tight">AI</span>
      </button>
    </div>
  );
};

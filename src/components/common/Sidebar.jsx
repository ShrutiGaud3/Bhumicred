import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  MapPin,
  ShieldAlert,
  FlaskConical,
  ShoppingBag,
  FolderKanban,
  Landmark,
  Leaf,
  Wallet,
  Gift,
  FileText,
  LifeBuoy,
  Users,
  Settings,
  X,
  FileCheck2,
  Sparkles,
  Receipt,
  Layers,
} from 'lucide-react';
import { ROLES } from '../../constants/roles.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || ROLES.FARMER;

  const farmerNavItems = [
    { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'Bhumitra AI', path: '/bhumitra-ai', icon: Sparkles, highlight: true },
    { label: 'My Land', path: '/farmer/lands', icon: MapPin },
    { label: 'GIS Cadastral Explorer', path: '/farmer/gis', icon: Layers },
    { label: 'Tree Insurance', path: '/farmer/insurance', icon: ShieldAlert },
    { label: 'Soil Testing', path: '/farmer/soil', icon: FlaskConical },
    { label: 'Reports & Invoices', path: '/farmer/invoices', icon: Receipt },
    { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { label: 'My Projects', path: '/farmer/projects', icon: FolderKanban },
    { label: 'Government Schemes', path: '/schemes', icon: Landmark },
    { label: 'Carbon Opportunities', path: '/carbon', icon: Leaf },
    { label: 'Wallet & Payouts', path: '/wallet', icon: Wallet },
    { label: 'Rewards & Referrals', path: '/rewards', icon: Gift },
    { label: 'Document Center', path: '/documents', icon: FileText },
    { label: 'Support & Help', path: '/support', icon: LifeBuoy },
  ];

  const govtNavItems = [
    { label: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
    { label: 'Bhumitra AI', path: '/bhumitra-ai', icon: Sparkles, highlight: true },
    { label: 'Public Assets', path: '/government/assets', icon: MapPin },
    { label: 'GIS Cadastral Explorer', path: '/gis', icon: Layers },
    { label: 'Farmers In Area', path: '/government/farmers', icon: Users },
    { label: 'On-Demand Campaigns', path: '/government/campaigns', icon: Landmark },
    { label: 'Area Projects', path: '/government/projects', icon: FolderKanban },
    { label: 'Public Tree Insurance', path: '/government/insurance', icon: ShieldAlert },
    { label: 'Soil Testing Drives', path: '/government/soil', icon: FlaskConical },
    { label: 'Government Schemes', path: '/schemes', icon: Landmark },
    { label: 'Document Vault', path: '/documents', icon: FileText },
    { label: 'Support Desk', path: '/support', icon: LifeBuoy },
  ];

  const partnerNavItems = [
    { label: 'Dashboard', path: '/partner/dashboard', icon: LayoutDashboard },
    { label: 'Bhumitra AI', path: '/bhumitra-ai', icon: Sparkles, highlight: true },
    { label: 'GIS Cadastral Explorer', path: '/gis', icon: Layers },
    { label: 'Assigned Tasks', path: '/partner/tasks', icon: FolderKanban },
    { label: 'Field Visits', path: '/partner/visits', icon: MapPin },
    { label: 'Inspections Queue', path: '/partner/inspections', icon: FileCheck2 },
    { label: 'Lab Sample Queue', path: '/partner/lab', icon: FlaskConical },
    { label: 'Reports & Uploads', path: '/partner/reports', icon: FileText },
    { label: 'Invoices & Payouts', path: '/partner/invoices', icon: Wallet },
    { label: 'Assigned Documents', path: '/documents', icon: FileText },
    { label: 'Partner Support', path: '/support', icon: LifeBuoy },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bhumitra AI', path: '/bhumitra-ai', icon: Sparkles, highlight: true },
    { label: 'Onboarding Approvals', path: '/admin/approvals', icon: Users },
    { label: 'Land & GIS Review', path: '/admin/lands', icon: MapPin },
    { label: 'GIS Cadastral Explorer', path: '/gis', icon: Layers },
    { label: 'Tree Insurance & Claims', path: '/admin/insurance', icon: ShieldAlert },
    { label: 'Soil & Lab Central', path: '/admin/soil', icon: FlaskConical },
    { label: 'Agri Marketplace', path: '/admin/marketplace', icon: ShoppingBag },
    { label: 'Project Control Center', path: '/admin/projects', icon: FolderKanban },
    { label: 'Carbon & Green Credits', path: '/admin/carbon', icon: Leaf },
    { label: 'Wallet & Payouts', path: '/admin/finance', icon: Wallet },
    { label: 'RBAC & Audit Logs', path: '/admin/audit', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  let navItems = farmerNavItems;
  if (role === ROLES.GOVERNMENT) navItems = govtNavItems;
  if (role === ROLES.PARTNER) navItems = partnerNavItems;
  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN_STAFF) navItems = adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4">
          {/* Top Brand & Close on Mobile */}
          <div className="flex items-center justify-between pb-5 pt-2 px-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-black text-sm">
                BC
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                BHUMICRED
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Sub-banner */}
          <div className="my-3 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase">
              {role.replace(/_/g, ' ')}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 mt-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/20'
                        : item.highlight
                        ? 'bg-emerald-50/70 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      item.highlight ? 'text-amber-500' : ''
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            BHUMICRED v1.0 • Connect. Grow. Sustain.
          </div>
        </div>
      </aside>
    </>
  );
};

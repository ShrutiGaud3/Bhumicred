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
  const isApproved =
    user?.role === ROLES.SUPER_ADMIN ||
    user?.role === ROLES.ADMIN_STAFF ||
    user?.status === 'APPROVED' ||
    user?.status === 'ACTIVE';

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
    { label: 'Support & Grievances', path: '/support', icon: LifeBuoy },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  let navItems = farmerNavItems;
  if (role === ROLES.GOVERNMENT) navItems = govtNavItems;
  if (role === ROLES.PARTNER) navItems = partnerNavItems;
  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN_STAFF) navItems = adminNavItems;

  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-slate-200/80 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4">
          {/* Top Brand & Close on Mobile/Tablets */}
          <div className="flex items-center justify-between pb-5 pt-2 px-2 border-b border-slate-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-black text-sm">
                BC
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">
                BHUMICRED
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Sub-banner */}
          {isApproved ? (
            <div className="my-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                {role.replace(/_/g, ' ')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
          ) : (
            <div className="my-3 px-3 py-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 tracking-wide uppercase block">
                  {role.replace(/_/g, ' ')}
                </span>
                <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold">
                  Pending Admin Approval
                </span>
              </div>
              <span className="p-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">LOCKED</span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 mt-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isLockedItem = !isApproved && item.label !== 'Dashboard' && item.label !== 'Support & Help';

              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/20'
                        : isLockedItem
                        ? 'text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800/50 cursor-pointer opacity-75'
                        : item.highlight
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                        : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        item.highlight ? 'text-amber-500' : ''
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isLockedItem && (
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono font-bold bg-amber-100/80 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                      Locked
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 text-[11px] text-slate-400 dark:text-neutral-500 text-center">
            BHUMICRED v1.0 • Connect. Grow. Sustain.
          </div>
        </div>
      </aside>
    </>
  );
};

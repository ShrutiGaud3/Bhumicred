import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  Search,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { logoutUser } from '../../features/auth/authSlice.js';
import { fetchUnreadCount } from '../../features/notifications/notificationSlice.js';
import { ROLE_LABELS } from '../../constants/roles.js';
import { LanguageSelector } from './LanguageSelector.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { NotificationDrawer } from '../layout/NotificationDrawer.jsx';

export const Header = ({ onToggleSidebar, onOpenAiModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPublicMobileMenu, setShowPublicMobileMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  React.useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
    }
  }, [user, dispatch]);

  const isPublicRoute = !user || (!location.pathname.startsWith('/farmer') &&
    !location.pathname.startsWith('/government') &&
    !location.pathname.startsWith('/partner') &&
    !location.pathname.startsWith('/admin'));

  const publicNavLinks = [
    { label: 'Solutions', path: '/solutions' },
    { label: 'For Farmers', path: '/farmer' },
    { label: 'Government', path: '/government' },
    { label: 'Partners', path: '/partner' },
    { label: 'Land & GIS', path: '/land' },
    { label: 'Insurance', path: '/tree-insurance' },
    { label: 'Soil Health', path: '/soil-testing' },
    { label: 'Marketplace', path: '/marketplace-overview' },
    { label: 'Schemes', path: '/schemes-overview' },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800 px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="flex items-center justify-between gap-2 max-w-full">
          {/* Left: Mobile Toggle & Brand/Role */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {user ? (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 sm:p-2 -ml-1 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl lg:hidden transition-colors"
                aria-label="Toggle Portal Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowPublicMobileMenu(!showPublicMobileMenu)}
                className="p-1.5 sm:p-2 -ml-1 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl lg:hidden transition-colors"
                aria-label="Toggle Public Menu"
              >
                {showPublicMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link
              to={
                user
                  ? user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_STAFF'
                    ? '/admin/dashboard'
                    : user.role === 'GOVERNMENT'
                    ? '/government/dashboard'
                    : user.role === 'PARTNER'
                    ? '/partner/dashboard'
                    : '/farmer/dashboard'
                  : '/'
              }
              className="flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-900/10 shrink-0">
                BC
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-emerald-950 dark:text-white tracking-tight">
                  BHUMI<span className="text-emerald-600 dark:text-emerald-400">CRED</span>
                </span>
              </div>
            </Link>

            {user && (
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ml-1">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {ROLE_LABELS[user.role] || user.role}
              </span>
            )}
          </div>

          {/* Center Public Links (on large screens for public visitors) */}
          {isPublicRoute && !user && (
            <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-600 dark:text-neutral-300">
              {publicNavLinks.slice(0, 7).map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    location.pathname === item.path ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right: Search, Bhumitra AI, Notifications, User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Command Palette Quick Search Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors border border-slate-200/80 dark:border-neutral-700"
              title="Search Portal (Ctrl + K)"
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden md:inline font-medium text-xs">Search...</span>
              <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-white dark:bg-neutral-700 text-slate-400 dark:text-neutral-300 border border-slate-200 dark:border-neutral-600">
                ⌘K
              </kbd>
            </button>

            {/* Bhumitra AI Assistant Quick Trigger (Tablets & Desktops) */}
            <button
              onClick={onOpenAiModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Ask AI</span>
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            {user && (
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-1.5 sm:p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 dark:text-neutral-300 dark:hover:text-emerald-400 dark:hover:bg-neutral-800 rounded-xl transition-colors border border-slate-200/80 dark:border-neutral-700"
                title="Open Notifications Drawer"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 shadow-sm animate-in zoom-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </button>
            )}

            {/* User Profile dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left max-w-[120px]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-none">{user.name || user.mobile}</p>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5 truncate">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-slate-100 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">{user.mobile}</p>
                      <span className="mt-1 inline-block text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                        {user.status}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-800"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-800"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-emerald-600/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                >
                  Register
                </Link>
                <Link
                  to="/role-select"
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-900/15 flex items-center gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Public Mobile Navigation Drawer */}
      {showPublicMobileMenu && !user && (
        <div className="lg:hidden bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <p className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider px-2">Explore BHUMICRED</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {publicNavLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setShowPublicMobileMenu(false)}
                className="p-2 rounded-lg bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-neutral-700 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex gap-2">
            <Link
              to="/role-select"
              onClick={() => setShowPublicMobileMenu(false)}
              className="w-full py-2 text-center rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Interactive Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

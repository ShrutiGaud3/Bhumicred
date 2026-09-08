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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPublicMobileMenu, setShowPublicMobileMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand/Role */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden"
                aria-label="Toggle Portal Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowPublicMobileMenu(!showPublicMobileMenu)}
                className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden"
                aria-label="Toggle Public Menu"
              >
                {showPublicMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md shadow-emerald-900/10">
                BC
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-emerald-950 tracking-tight">
                  BHUMI<span className="text-emerald-600">CRED</span>
                </span>
              </div>
            </Link>

            {user && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ml-2">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {ROLE_LABELS[user.role] || user.role}
              </span>
            )}
          </div>

          {/* Center Public Links (on large screens for public visitors) */}
          {isPublicRoute && !user && (
            <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-600">
              {publicNavLinks.slice(0, 7).map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`hover:text-emerald-700 transition-colors ${
                    location.pathname === item.path ? 'text-emerald-700 font-extrabold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right: Search, Bhumitra AI, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Quick Search Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors border border-slate-200/80 dark:border-neutral-700"
              title="Search Portal (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-medium">Quick Search...</span>
              <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-neutral-700 text-slate-400 dark:text-neutral-300 border border-slate-200 dark:border-neutral-600">
                ⌘K
              </kbd>
            </button>

            {/* Bhumitra AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Ask Bhumitra AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            {user && (
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Open Notifications Drawer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </button>
            )}

            {/* User Profile dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left max-w-[120px]">
                    <p className="text-xs font-bold text-slate-900 truncate leading-none">{user.name || user.mobile}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-500">{user.mobile}</p>
                      <span className="mt-1 inline-block text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {user.status}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-emerald-600/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                >
                  Register
                </Link>
                <Link
                  to="/role-select"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-900/15 flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Public Mobile Navigation Drawer */}
      {showPublicMobileMenu && !user && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Explore BHUMICRED</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {publicNavLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setShowPublicMobileMenu(false)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex gap-2">
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

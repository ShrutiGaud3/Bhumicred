import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setUser } from '../../features/auth/authSlice.js';
import { ROLES } from '../../constants/roles.js';
import { storageService } from '../../services/storageService.js';
import { useToast } from '../ui/ToastContext.jsx';
import {
  Sparkles,
  User,
  Shield,
  Building2,
  Briefcase,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Bot
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    role: ROLES.FARMER,
    title: 'Farmer',
    name: 'Ramesh Patel',
    details: 'Anand District, Gujarat (12.4 Acres)',
    targetRoute: '/farmer/dashboard',
    badgeColor: 'bg-emerald-500',
    icon: User,
    userPayload: {
      id: 'usr_farmer_01',
      name: 'Ramesh Patel',
      mobile: '+91 98765 43210',
      role: ROLES.FARMER,
      kycStatus: 'APPROVED',
      isLoggedIn: true,
    }
  },
  {
    role: ROLES.GOVERNMENT,
    title: 'Govt Nodal Officer',
    name: 'Kavita Sharma',
    details: 'Agriculture Dept, Gandhinagar',
    targetRoute: '/government/dashboard',
    badgeColor: 'bg-blue-500',
    icon: Building2,
    userPayload: {
      id: 'usr_gov_01',
      name: 'Kavita Sharma',
      mobile: '+91 91234 56789',
      role: ROLES.GOVERNMENT,
      kycStatus: 'APPROVED',
      isLoggedIn: true,
    }
  },
  {
    role: ROLES.PARTNER,
    title: 'Enterprise Partner',
    name: 'Devang Joshi',
    details: 'TerraAgri Labs & Drone Survey',
    targetRoute: '/partner/dashboard',
    badgeColor: 'bg-amber-500',
    icon: Briefcase,
    userPayload: {
      id: 'usr_partner_01',
      name: 'Devang Joshi',
      mobile: '+91 98111 22334',
      role: ROLES.PARTNER,
      kycStatus: 'APPROVED',
      isLoggedIn: true,
    }
  },
  {
    role: ROLES.SUPER_ADMIN,
    title: 'Super Admin',
    name: 'Vikram Singh',
    details: 'National Grid Controller',
    targetRoute: '/admin/dashboard',
    badgeColor: 'bg-rose-500',
    icon: Shield,
    userPayload: {
      id: 'usr_admin_01',
      name: 'Vikram Singh',
      mobile: '+91 99999 00000',
      role: ROLES.SUPER_ADMIN,
      kycStatus: 'APPROVED',
      isLoggedIn: true,
    }
  }
];

export const DemoRoleBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeRole = user?.role || ROLES.FARMER;

  const toast = useToast();

  const handleResetDemo = () => {
    storageService.resetToFactoryDefaults();
    toast.info('Demo database reset to factory pristine mock records!');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleRoleSwitch = (persona) => {
    dispatch(setUser(persona.userPayload));
    navigate(persona.targetRoute);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md text-white border-t border-neutral-700 shadow-2xl transition-all duration-300">
      {/* Collapsed view pill */}
      {isCollapsed ? (
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-neutral-300">Live Demo Mode</span>
            <span className="text-neutral-500">|</span>
            <span className="text-emerald-400 font-medium">
              Current Role: {user?.name || 'Demo User'} ({activeRole})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="text-neutral-400 hover:text-amber-400 font-medium text-xs flex items-center gap-1 transition-colors"
              title="Reset Demo Records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => navigate('/bhumitra-ai')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              Bhumitra AI Page
            </button>
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-1 text-neutral-400 hover:text-white font-medium transition-colors"
            >
              Switch Role <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded full switcher view */
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Header info */}
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    1-Click Role Switcher
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-800 text-neutral-300">
                      Frontend Demo
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Switch stakeholder personas to test workflows instantly
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCollapsed(true)}
                className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Role Persona Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-3xl">
              {DEMO_PERSONAS.map((persona) => {
                const Icon = persona.icon;
                const isActive = activeRole === persona.role;
                return (
                  <button
                    key={persona.role}
                    onClick={() => handleRoleSwitch(persona)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all border ${
                      isActive
                        ? 'bg-neutral-800 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'bg-neutral-800/60 border-neutral-700/70 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-300'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${persona.badgeColor}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate text-white">
                        {persona.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {persona.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions & Minimize */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleResetDemo}
                className="hidden xl:flex items-center gap-1 px-3 py-2 text-xs text-neutral-400 hover:text-amber-400 font-medium hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-700/60"
                title="Reset Demo Records to Defaults"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Data
              </button>

              <button
                onClick={() => navigate('/bhumitra-ai')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden md:flex items-center gap-1 px-2.5 py-2 text-xs text-neutral-400 hover:text-white font-medium hover:bg-neutral-800 rounded-xl transition-colors"
                title="Minimize Demo Bar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

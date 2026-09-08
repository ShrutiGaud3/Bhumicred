import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout = () => {
  const location = useLocation();

  // Pages that need a wider, more comfortable responsive canvas
  const isWideAuthPage = 
    location.pathname.startsWith('/register') || 
    location.pathname.startsWith('/onboarding') || 
    location.pathname.startsWith('/verification-pending') ||
    location.pathname.startsWith('/query-correction');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="mx-auto w-full text-center z-10 mb-4 sm:mb-6">
        <Link to="/" className="inline-flex items-center gap-2 sm:gap-2.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-500/20">
            BC
          </div>
          <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
            BHUMI<span className="text-emerald-400">CRED</span>
          </span>
        </Link>
        <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-semibold text-emerald-300 tracking-wide uppercase">
          Connect. Grow. Sustain.
        </p>
      </div>

      {/* Main Auth Container */}
      <div className={`mx-auto w-full z-10 transition-all duration-300 ${
        isWideAuthPage ? 'max-w-3xl' : 'max-w-md'
      }`}>
        <div className="bg-white/95 backdrop-blur-xl py-6 px-4 sm:py-8 sm:px-8 md:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-white/20">
          <Outlet />
        </div>
        <p className="mt-4 sm:mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          End-to-end encrypted & Sovereign verified
        </p>
      </div>
    </div>
  );
};

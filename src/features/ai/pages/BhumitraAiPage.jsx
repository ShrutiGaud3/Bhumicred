import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Bot,
  HelpCircle,
  Zap,
  ShieldCheck,
  History,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { BhumitraAiChat } from '../components/BhumitraAiChat.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { ROLE_LABELS } from '../../../constants/roles.js';

export const BhumitraAiPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const activeRole = user?.role || 'FARMER';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb / Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Active Portal Role:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
            {ROLE_LABELS[activeRole] || activeRole}
          </span>
        </div>
      </div>

      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Sovereign Intelligence Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bhumitra AI Intelligence Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time informational assistance on GIS land mapping standards, tree & plantation insurance quotes, laboratory soil nutrient analysis, government scheme assistance, and partner workflows.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs space-y-1.5 max-w-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Sovereignty Safeguards</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              AI provides read-only advisory guidance and deep-links to verified backend workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Main Full-page Chat Interface Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden h-[680px] flex flex-col">
        <BhumitraAiChat />
      </div>
    </div>
  );
};

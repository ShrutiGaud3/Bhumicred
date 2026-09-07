import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

export const BhumitraFloatingButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-800/60 border border-emerald-400/30 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open Bhumitra AI Assistant"
      >
        {/* Glow ambient background ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 opacity-40 group-hover:opacity-75 blur transition duration-500 animate-pulse"></span>

        <div className="relative flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          </div>
          <span className="tracking-tight">Bhumitra AI</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase">
            Help
          </span>
        </div>
      </button>
    </div>
  );
};

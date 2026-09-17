import React from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';

export const RoleSuggestionChips = ({ questions = [], onSelectQuestion }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-2 my-4">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Suggested Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(question)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-neutral-800/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-900 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-xs text-slate-700 dark:text-neutral-300 text-left transition-all duration-150 hover:-translate-y-0.5"
          >
            <span className="truncate max-w-xs">{question}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-neutral-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

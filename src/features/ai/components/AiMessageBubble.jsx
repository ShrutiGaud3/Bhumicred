import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  User as UserIcon,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Sparkles,
  Volume2,
} from 'lucide-react';

export const AiMessageBubble = ({ message, onActionClick }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isAi = message.sender === 'ai';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 my-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isAi ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm ${
          isAi
            ? 'bg-gradient-to-tr from-emerald-800 to-teal-700 text-white shadow-emerald-900/10'
            : 'bg-slate-800 text-white'
        }`}
      >
        {isAi ? <Sparkles className="w-4 h-4 text-amber-300" /> : <UserIcon className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
          isAi ? 'items-start' : 'items-end'
        }`}
      >
        {/* Author Label */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400 font-medium">
          <span>{isAi ? 'Bhumitra AI' : 'You'}</span>
          <span>•</span>
          <span>{message.timestamp || 'Just now'}</span>
        </div>

        {/* Bubble Content */}
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isAi
              ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm'
              : 'bg-emerald-800 text-white rounded-tr-none shadow-md shadow-emerald-900/10'
          }`}
        >
          {/* Format simple line breaks and bold markers */}
          <div className="whitespace-pre-line space-y-1.5 font-normal">
            {message.text.split('\n').map((paragraph, pIdx) => {
              // Highlight bold tags if any
              return <p key={pIdx}>{paragraph}</p>;
            })}
          </div>

          {/* Optional Direct Deep-Link Action Button */}
          {message.suggestedAction && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Suggested Action:</span>
              <Link
                to={message.suggestedAction.path}
                onClick={onActionClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200"
              >
                <span>{message.suggestedAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* AI Action Toolbar (Copy, Thumbs Up/Down, Speak Mock) */}
        {isAi && (
          <div className="flex items-center gap-1 mt-1.5 px-1 text-slate-400 text-xs">
            <button
              onClick={handleCopy}
              className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`p-1 rounded-md transition-colors ${
                feedback === 'up' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`p-1 rounded-md transition-colors ${
                feedback === 'down' ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

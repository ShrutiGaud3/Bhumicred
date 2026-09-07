import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Send,
  Sparkles,
  RotateCcw,
  Mic,
  Bot,
  ShieldAlert,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { AiMessageBubble } from './AiMessageBubble.jsx';
import { RoleSuggestionChips } from './RoleSuggestionChips.jsx';
import { QuickActionCards } from './QuickActionCards.jsx';
import { ROLE_AI_CONTEXTS, MOCK_AI_RESPONSES } from '../constants/aiPresets.js';
import { ROLES, ROLE_LABELS } from '../../../constants/roles.js';

export const BhumitraAiChat = ({ onNavigateAction, initialRole = null }) => {
  const { user } = useSelector((state) => state.auth);

  // Active Role in AI context (defaults to authenticated user role or Farmer)
  const defaultRole = initialRole || user?.role || ROLES.FARMER;
  const [activeRole, setActiveRole] = useState(defaultRole);

  const roleContext = ROLE_AI_CONTEXTS[activeRole] || ROLE_AI_CONTEXTS.FARMER;

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: roleContext.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListeningMock, setIsListeningMock] = useState(false);
  const messagesEndRef = useRef(null);

  // When active role changes, reset/re-greet
  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    const ctx = ROLE_AI_CONTEXTS[newRole] || ROLE_AI_CONTEXTS.FARMER;
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'ai',
        text: ctx.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Static mock AI response matcher
  const generateMockAiResponse = (query) => {
    const lower = query.toLowerCase();

    // Find best match in mock responses
    for (const item of MOCK_AI_RESPONSES) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        return {
          text: item.response,
          suggestedAction: item.suggestedAction,
        };
      }
    }

    // Default intelligent fallback based on role
    return {
      text: `Under the **${ROLE_LABELS[activeRole] || activeRole}** scope, I can assist you with understanding policy requirements, step-by-step procedures, soil test diagnostics, and scheme verifications.
      
💡 **Helpful Tip**: Try asking about **"Land Registration"**, **"Tree Insurance"**, **"Soil Test Booking"**, or **"Government Schemes"** for specialized assistance.`,
      suggestedAction: {
        label: 'Explore Solutions',
        path: '/solutions',
      },
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate natural AI thinking delay (600ms - 1000ms)
    setTimeout(() => {
      const match = generateMockAiResponse(query);
      const aiReply = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: match.text,
        suggestedAction: match.suggestedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 850);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'ai',
        text: roleContext.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleVoiceMock = () => {
    setIsListeningMock(true);
    setTimeout(() => {
      setIsListeningMock(false);
      setInputQuery('How to apply for Tree & Plantation Insurance?');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Role Context Bar & Switcher */}
      <div className="p-3 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-800">
            {roleContext.title}
          </span>
        </div>

        {/* Role Selector Tabs for UI demonstration */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold">
          {Object.keys(ROLE_AI_CONTEXTS).map((rKey) => (
            <button
              key={rKey}
              onClick={() => handleRoleChange(rKey)}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeRole === rKey
                  ? 'bg-white text-emerald-800 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {rKey === 'SUPER_ADMIN' ? 'Admin' : rKey.charAt(0) + rKey.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Role Welcome Banner inside stream */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-extrabold tracking-wide uppercase">
                Bhumitra AI Intelligence
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              Static Mode • Sovereign RBAC
            </span>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            {roleContext.tagline}
          </p>
        </div>

        {/* Render Message Bubbles */}
        {messages.map((msg) => (
          <AiMessageBubble
            key={msg.id}
            message={msg}
            onActionClick={onNavigateAction}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center text-xs shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <div className="p-3.5 bg-white rounded-2xl rounded-tl-none border border-slate-200/80 shadow-sm flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Bhumitra AI is typing</span>
              <span className="flex gap-1 items-center pt-1">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              </span>
            </div>
          </div>
        )}

        {/* Suggested Question Chips (Always readily accessible at bottom of conversation) */}
        {!isTyping && (
          <div className="pt-2 border-t border-slate-100">
            <RoleSuggestionChips
              questions={roleContext.suggestedQuestions}
              onSelectQuestion={handleSendMessage}
            />
            <QuickActionCards
              actions={roleContext.quickActions}
              onActionClick={onNavigateAction}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 shadow-lg">
        {isListeningMock && (
          <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 animate-pulse">
            <Mic className="w-4 h-4 text-amber-600" />
            <span>Listening to speech input... (Mock Voice Recognition)</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleVoiceMock}
            className="p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Voice Input (Mock)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask Bhumitra AI about ${activeRole === 'FARMER' ? 'lands, insurance, soil...' : 'jurisdiction, campaigns...'}`}
            className="flex-1 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="mt-2 text-center text-[10px] text-slate-400">
          Bhumitra AI provides informational guidance. Inquiries adhere to sovereign RBAC and jurisdiction boundaries.
        </div>
      </div>
    </div>
  );
};

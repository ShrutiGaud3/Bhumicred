import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toasts Viewport */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const typeStyles = {
            success: 'bg-emerald-800 text-white border-emerald-700 shadow-emerald-950/20',
            error: 'bg-rose-800 text-white border-rose-700 shadow-rose-950/20',
            warning: 'bg-amber-800 text-white border-amber-700 shadow-amber-950/20',
            info: 'bg-slate-800 text-white border-slate-700 shadow-slate-950/20',
          };

          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
            error: <XCircle className="w-5 h-5 text-rose-300 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-300 shrink-0" />,
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-200 backdrop-blur-sm ${
                typeStyles[t.type] || typeStyles.success
              }`}
            >
              <div className="flex items-center gap-2.5">
                {icons[t.type] || icons.success}
                <p className="text-xs font-semibold leading-snug">{t.message}</p>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (msg) => console.log('Toast success:', msg),
      error: (msg) => console.log('Toast error:', msg),
      info: (msg) => console.log('Toast info:', msg),
      warning: (msg) => console.log('Toast warning:', msg),
    };
  }
  return context;
};

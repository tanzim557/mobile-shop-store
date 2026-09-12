import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-500/30 bg-emerald-950/40',
          error: 'border-rose-500/30 bg-rose-950/40',
          warning: 'border-amber-500/30 bg-amber-950/40',
          info: 'border-indigo-500/30 bg-indigo-950/40',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border ${borderColors[t.type]} bg-zinc-900/90 text-zinc-100 transition-all duration-300 animate-fade-in`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-100 leading-tight">{t.title}</p>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed break-words">{t.message}</p>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              aria-label="Close toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

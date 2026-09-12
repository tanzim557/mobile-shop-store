import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface DeveloperBadgeProps {
  className?: string;
}

export const DeveloperBadge: React.FC<DeveloperBadgeProps> = ({ className = '' }) => {
  return (
    <a
      href="https://mubassher-alam-tanzim.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      title="Visit Mubassher Alam Portfolio"
      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium 
        bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md
        border border-indigo-200/80 dark:border-indigo-900/50 
        hover:border-indigo-500/80 dark:hover:border-indigo-500/80 
        shadow-sm hover:shadow-md hover:shadow-indigo-500/10 
        transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {/* Subtle pulsing beacon */}
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
      </span>

      {/* Developer Name */}
      <span className="text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
        <span>Developed by</span>
        <strong className="font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Mubassher Alam
        </strong>
      </span>

      <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>

      {/* Portfolio Link Pill */}
      <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
        <span>🌐 Portfolio</span>
        <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
};

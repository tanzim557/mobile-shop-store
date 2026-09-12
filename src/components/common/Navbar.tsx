import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Smartphone, 
  Boxes, 
  CreditCard, 
  BarChart3, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  RotateCcw,
  Globe,
  Flame
} from 'lucide-react';
import type { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    theme, 
    toggleTheme, 
    setIsNewTicketModalOpen, 
    setIsCmdPaletteOpen,
    tickets,
    parts,
    resetToDemoData 
  } = useApp();

  const navItems: { role: UserRole; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { role: 'front_desk', label: 'Front Desk', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { 
      role: 'technician', 
      label: 'Workbench', 
      icon: <Wrench className="w-3.5 h-3.5" />,
      badge: tickets.filter(t => t.status === 'repairing' || t.status === 'diagnosing' || t.status === 'qc').length
    },
    { 
      role: 'inventory', 
      label: 'Inventory', 
      icon: <Boxes className="w-3.5 h-3.5" />,
      badge: parts.filter(p => p.stockQty <= p.minThreshold).length || undefined
    },
    { role: 'pos', label: 'POS Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { role: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { role: 'public_portal', label: 'Live Tracking', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  const urgentTicketsCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'delivered' && t.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          
          {/* Brand Identity */}
          <div 
            onClick={() => setCurrentRole('front_desk')}
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group select-none py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-sm shadow-brand-500/25 ring-1 ring-black/5 dark:ring-white/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-sm sm:text-base text-zinc-900 dark:text-white">
                  FixPoint<span className="text-brand-600 dark:text-brand-400">.erp</span>
                </span>
                <span className="px-1 py-0.2 text-[9px] font-bold tracking-wider uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 rounded">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline leading-tight mt-0.5">
                Repair Operating System
              </span>
            </div>
          </div>

          {/* Role Navigation Pills - Segmented Control */}
          <nav className="hidden lg:flex items-center gap-0.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {navItems.map((item) => {
              const isActive = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => setCurrentRole(item.role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-150 relative h-7 flex-shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className={`px-1.5 py-0.2 text-[9px] rounded-full font-bold leading-none ${
                      item.role === 'inventory' 
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30' 
                        : 'bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Urgent Badge */}
            {urgentTicketsCount > 0 && (
              <div 
                onClick={() => setCurrentRole('technician')}
                className="hidden xl:flex items-center gap-1.5 px-2.5 h-7.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer hover:bg-rose-500/20 transition-colors whitespace-nowrap"
                title={`${urgentTicketsCount} urgent repair orders`}
              >
                <Flame className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                <span>{urgentTicketsCount} Urgent</span>
              </div>
            )}

            {/* Quick Search */}
            <button
              onClick={() => setIsCmdPaletteOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 h-8 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors whitespace-nowrap group"
              title="Search tickets or parts (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-500 transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-flex items-center px-1 text-[9px] font-mono text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                ⌘K
              </kbd>
            </button>

            {/* "+ New Ticket" Button */}
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm shadow-brand-500/25 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
              <kbd className="hidden sm:inline-flex items-center px-1 text-[9px] font-mono text-brand-200 bg-brand-700/60 rounded">
                N
              </kbd>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors flex-shrink-0"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all repair tickets and inventory catalog to default demo data?')) {
                  resetToDemoData();
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex-shrink-0"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scrollable Tabs */}
        <div className="flex lg:hidden overflow-x-auto pb-2 pt-1 gap-1 scrollbar-none border-t border-zinc-100 dark:border-zinc-900">
          {navItems.map((item) => (
            <button
              key={item.role}
              onClick={() => setCurrentRole(item.role)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold whitespace-nowrap rounded-lg transition-colors flex-shrink-0 ${
                currentRole === item.role
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span className="px-1 text-[9px] rounded-full bg-white/20 text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};

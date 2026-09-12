import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Smartphone, 
  Wrench, 
  Boxes, 
  CreditCard, 
  BarChart3, 
  Globe, 
  Plus, 
  X, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCmdPaletteOpen,
    setIsCmdPaletteOpen,
    setCurrentRole,
    setIsNewTicketModalOpen,
    tickets,
    parts,
    openJobModal,
    toggleTheme
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCmdPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCmdPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCmdPaletteOpen) {
        setIsCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdPaletteOpen, setIsCmdPaletteOpen]);

  if (!isCmdPaletteOpen) return null;

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(query.toLowerCase()) ||
      t.customer.phone.includes(query) ||
      t.device.model.toLowerCase().includes(query.toLowerCase()) ||
      t.device.brand.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredParts = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.compatibleModels.some((m) => m.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsCmdPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search ticket ID, customer, device, or part SKU..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs p-1"
            >
              Clear
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded">
            ESC
          </kbd>
          <button
            onClick={() => setIsCmdPaletteOpen(false)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          
          {/* Quick Actions */}
          {(!query || 'new ticket create intake'.includes(query.toLowerCase())) && (
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Quick Actions</p>
              <button
                onClick={() => {
                  setIsCmdPaletteOpen(false);
                  setIsNewTicketModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-brand-50 dark:hover:bg-brand-600/20 hover:text-brand-600 dark:hover:text-brand-300 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Create New Repair Ticket</span>
                </div>
                <kbd className="text-[10px] font-mono text-zinc-400 group-hover:text-brand-500">N</kbd>
              </button>
              
              <button
                onClick={() => {
                  setIsCmdPaletteOpen(false);
                  toggleTheme();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Toggle Dark / Light Theme</span>
                </div>
              </button>
            </div>
          )}

          {/* Matching Tickets */}
          {filteredTickets.length > 0 && (
            <div className="pt-3 space-y-1">
              <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Matching Repair Tickets ({filteredTickets.length})
              </p>
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setIsCmdPaletteOpen(false);
                    openJobModal(ticket);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{ticket.id}</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200">{ticket.device.model}</span>
                    <span className="text-zinc-500">• {ticket.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Matching Parts */}
          {filteredParts.length > 0 && (
            <div className="pt-3 space-y-1">
              <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Spare Parts Catalog ({filteredParts.length})
              </p>
              {filteredParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => {
                    setIsCmdPaletteOpen(false);
                    setCurrentRole('inventory');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Boxes className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-200">{part.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{part.sku} • Bin: {part.locationBin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${part.stockQty <= part.minThreshold ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {part.stockQty} in stock
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">${part.sellingPrice.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Views */}
          <div className="pt-3 space-y-1">
            <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Jump To Screen</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { role: 'front_desk' as const, label: 'Front Desk Intake', icon: <Smartphone className="w-3.5 h-3.5" /> },
                { role: 'technician' as const, label: 'Technician Kanban', icon: <Wrench className="w-3.5 h-3.5" /> },
                { role: 'inventory' as const, label: 'Spare Parts Catalog', icon: <Boxes className="w-3.5 h-3.5" /> },
                { role: 'pos' as const, label: 'POS Split Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { role: 'analytics' as const, label: 'Workshop Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { role: 'public_portal' as const, label: 'Customer Live Tracker', icon: <Globe className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    setIsCmdPaletteOpen(false);
                    setCurrentRole(item.role);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Navigate with mouse or keyboard</span>
          <span>FixPoint Command Engine</span>
        </div>
      </div>
    </div>
  );
};

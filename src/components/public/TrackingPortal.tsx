import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { RepairTicket, TicketStatus } from '../../types';
import { 
  Search, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  MessageCircle, 
  Sparkles, 
  AlertCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TrackingPortal: React.FC = () => {
  const { tickets, trackingSearchTicketId } = useApp();

  const [query, setQuery] = useState(trackingSearchTicketId || 'FP-8492');
  const [searchedTicket, setSearchedTicket] = useState<RepairTicket | null>(() => {
    return tickets.find(t => t.id === 'FP-8492') || tickets[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(true);

  // Sync if trackingSearchTicketId changes from URL or global state
  useEffect(() => {
    if (trackingSearchTicketId) {
      setQuery(trackingSearchTicketId);
      const match = tickets.find(
        (t) =>
          t.id.toLowerCase() === trackingSearchTicketId.toLowerCase() ||
          t.customer.phone.includes(trackingSearchTicketId)
      );
      if (match) {
        setSearchedTicket(match);
        setHasSearched(true);
      }
    }
  }, [trackingSearchTicketId, tickets]);

  const handleSearch = (ticketIdToFind?: string) => {
    const q = (ticketIdToFind || query).trim();
    if (!q) return;

    const found = tickets.find(
      (t) =>
        t.id.toLowerCase() === q.toLowerCase() ||
        t.customer.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );

    setSearchedTicket(found || null);
    setHasSearched(true);
  };

  const stages: { key: TicketStatus; label: string; desc: string }[] = [
    { key: 'received', label: 'Device Received', desc: 'Intake logged & initial inspection' },
    { key: 'diagnosing', label: 'Diagnosis', desc: 'Hardware & circuit diagnostics' },
    { key: 'parts_awaited', label: 'Parts Awaiting', desc: 'OEM components queue' },
    { key: 'repairing', label: 'Active Repair', desc: 'Bench assembly & soldering' },
    { key: 'qc', label: 'Quality Check', desc: '8-point hardware verification' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'Sanitized and boxed for pickup' },
  ];

  const getStageIndex = (status: TicketStatus) => {
    if (status === 'delivered') return 6;
    const index = stages.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStageIndex = searchedTicket ? getStageIndex(searchedTicket.status) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>FixPoint Public Service Tracking Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          Track Your Device Repair Live
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          View live repair stages, hardware inspection results, technician bench notes, and warranty status in real-time.
        </p>
      </div>

      {/* Interactive Search Box */}
      <div className="p-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Ticket ID (e.g. FP-8492) or Mobile Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-medium"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/25 hover:shadow-glow-brand transition-all active:scale-95"
          >
            Track Device
          </button>
        </div>

        {/* Quick Demo Ticket Chips */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 overflow-x-auto text-xs">
          <span className="text-zinc-500 text-[11px] whitespace-nowrap">Try Demo Ticket:</span>
          {['FP-8492', 'FP-7120', 'FP-3901', 'FP-5541', 'FP-4419'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setQuery(demoId);
                handleSearch(demoId);
              }}
              className="px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-brand-500/20 text-zinc-700 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-300 transition-colors whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
            >
              #{demoId}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {hasSearched && (
        searchedTicket ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* Live Status Progress Bar */}
            <div className="p-6 bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Service Order</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-black text-2xl text-brand-600 dark:text-brand-400">#{searchedTicket.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/30 font-bold uppercase">
                      {searchedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Estimated Delivery</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-0.5 flex items-center sm:justify-end gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span>{new Date(searchedTicket.estimatedDelivery).toLocaleDateString()} by {new Date(searchedTicket.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>

              {/* Progress Stepper with responsive cards */}
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {stages.map((stage, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isCurrent
                            ? 'bg-brand-500/10 border-brand-500 text-brand-700 dark:text-white shadow-sm ring-1 ring-brand-500/40'
                            : isPassed
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                            : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isPassed 
                              ? 'bg-emerald-600 text-white' 
                              : isCurrent 
                              ? 'bg-brand-600 text-white animate-pulse' 
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                          }`}>
                            {isPassed ? '✓' : idx + 1}
                          </span>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                          )}
                        </div>

                        <div>
                          <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-brand-600 dark:text-brand-300' : isPassed ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ready Notification Banner */}
              {searchedTicket.status === 'ready' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Your device is fully repaired and ready for pickup!</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Please present Ticket #{searchedTicket.id} at the front counter.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Device Diagnostic & Cost Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Device Overview Card */}
              <div className="p-6 bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <Smartphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Serviced Device Specs</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Make & Model:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{searchedTicket.device.brand} {searchedTicket.device.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Color / Finish:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{searchedTicket.device.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Device IMEI:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">•••••••••••{searchedTicket.device.imei.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lead Technician:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{searchedTicket.technicianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Official Warranty:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {searchedTicket.warrantyPeriod}
                    </span>
                  </div>
                </div>

                {/* Fault Tags */}
                <div className="pt-2">
                  <span className="text-xs text-zinc-500 block mb-1.5 font-semibold">Logged Faults:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchedTicket.faults.map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] border border-zinc-200 dark:border-zinc-700 font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {searchedTicket.technicianNotes && (
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Technician Notes</span>
                    <p className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px] leading-relaxed">
                      {searchedTicket.technicianNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Quotation & Direct Support Card */}
              <div className="p-6 bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Service Quotation & Billing</h3>
                  </div>

                  <div className="space-y-2 text-xs pt-3">
                    <div className="flex justify-between text-zinc-500">
                      <span>Parts & Components:</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">${searchedTicket.billing.partsCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Workshop Labor Fee:</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">${searchedTicket.billing.laborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Diagnostic Fee:</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">
                        {searchedTicket.billing.waiveDiagnosticFee ? '$0.00 (Waived)' : `$${searchedTicket.billing.diagnosticFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Sales Tax (8.25%):</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">${searchedTicket.billing.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-sm text-zinc-900 dark:text-white">
                      <span>Total Estimated Cost:</span>
                      <span className="font-mono text-brand-600 dark:text-brand-400">${searchedTicket.billing.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Deposit Paid:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">-${searchedTicket.billing.depositPaid.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex justify-between font-bold text-xs text-amber-600 dark:text-amber-400">
                      <span>Remaining Balance:</span>
                      <span className="font-mono text-sm">${searchedTicket.billing.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Support Button */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/?text=Hi%20FixPoint%2C%20I%20have%20an%20inquiry%20about%20my%20repair%20ticket%20%23${searchedTicket.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/25 hover:shadow-glow-emerald transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat with Workshop Desk on WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm">
            <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Service Ticket Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn't locate a repair record matching "{query}". Please verify your ticket ID on your receipt.
            </p>
          </div>
        )
      )}

    </div>
  );
};

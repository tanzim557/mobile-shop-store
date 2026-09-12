import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TicketPriority, TicketStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Smartphone, 
  Wrench, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

export const IntakeDashboard: React.FC = () => {
  const { 
    tickets, 
    setIsNewTicketModalOpen, 
    openServiceTagModal, 
    openReceiptModal, 
    openJobModal,
    setCurrentRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // KPI calculations
  const totalActive = tickets.filter(t => t.status !== 'delivered' && t.status !== 'cancelled').length;
  const inQueueCount = tickets.filter(t => t.status === 'received').length;
  const diagnosingCount = tickets.filter(t => t.status === 'diagnosing').length;
  const repairingCount = tickets.filter(t => t.status === 'repairing' || t.status === 'parts_awaited' || t.status === 'qc').length;
  const readyCount = tickets.filter(t => t.status === 'ready').length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'delivered').length;

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.phone.includes(searchQuery) ||
      t.device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.device.imei.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: TicketStatus) => {
    const map: Record<TicketStatus, { label: string; className: string }> = {
      received: { label: 'In Queue', className: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700' },
      diagnosing: { label: 'Diagnosing', className: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
      parts_awaited: { label: 'Waiting Parts', className: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
      repairing: { label: 'In Repair', className: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50' },
      qc: { label: 'Quality Check', className: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' },
      ready: { label: 'Ready for Pickup', className: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 font-semibold' },
      delivered: { label: 'Delivered', className: 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 border-zinc-200 dark:border-zinc-800' },
      cancelled: { label: 'Cancelled', className: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' },
    };
    const item = map[status] || map.received;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${item.className}`}>
        {item.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-500" />
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            Normal
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Front-Desk & Intake Terminal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Rapid device intake, thermal sticker printing, customer queue, and service orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-glow-brand transition-all active:scale-95 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>+ New Repair Ticket</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-brand-200 bg-brand-700/60 rounded">
              N
            </kbd>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Repairs', count: totalActive, icon: <Smartphone className="w-4 h-4 text-brand-500" />, filter: 'all' },
          { label: 'In Queue', count: inQueueCount, icon: <Clock className="w-4 h-4 text-zinc-400" />, filter: 'received' },
          { label: 'Diagnosing', count: diagnosingCount, icon: <Wrench className="w-4 h-4 text-blue-500" />, filter: 'diagnosing' },
          { label: 'Bench / QC', count: repairingCount, icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />, filter: 'repairing' },
          { label: 'Ready Pickup', count: readyCount, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, filter: 'ready' },
          { label: 'Urgent Express', count: urgentCount, icon: <Flame className="w-4 h-4 text-rose-500" />, filter: 'urgent' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (kpi.filter === 'urgent') {
                setPriorityFilter('urgent');
                setStatusFilter('all');
              } else {
                setStatusFilter(kpi.filter);
                setPriorityFilter('all');
              }
            }}
            className="p-3.5 bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-brand-500/50 hover:shadow-md transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {kpi.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, ticket ID (FP-8492), or device model..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'received', label: 'In Queue' },
              { id: 'diagnosing', label: 'Diagnosing' },
              { id: 'repairing', label: 'In Repair' },
              { id: 'ready', label: 'Ready' },
              { id: 'delivered', label: 'Delivered' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent Only</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Repair Tickets Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4">Ticket / Priority</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Device & Faults</th>
                <th className="py-3 px-4">Security Passcode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Billing & Balance</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No repair tickets found</p>
                    <p className="text-xs text-zinc-400 mt-1">Try resetting search filters or log a new intake</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                    onClick={() => openJobModal(ticket)}
                  >
                    {/* Ticket ID & Priority */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1 items-start">
                        <button
                          onClick={() => openJobModal(ticket)}
                          className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline text-sm tracking-tight flex items-center gap-1"
                        >
                          <span>{ticket.id}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-zinc-900 dark:text-white">{ticket.customer.name}</p>
                          {ticket.customer.isVip && (
                            <span className="px-1 py-0.2 text-[9px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded border border-amber-500/30">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{ticket.customer.phone}</p>
                      </div>
                    </td>

                    {/* Device & Faults */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {ticket.device.brand} {ticket.device.model}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ticket.faults.slice(0, 2).map((fault, idx) => (
                            <span 
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 truncate max-w-[140px]"
                              title={fault}
                            >
                              {fault}
                            </span>
                          ))}
                          {ticket.faults.length > 2 && (
                            <span className="text-[10px] text-zinc-400 self-center">
                              +{ticket.faults.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Passcode / Lock */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {ticket.device.lockType === 'pin' && (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          PIN: {ticket.device.lockCode}
                        </span>
                      )}
                      {ticket.device.lockType === 'pattern' && (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 text-[10px]">
                          Pattern: {ticket.device.lockCode}
                        </span>
                      )}
                      {ticket.device.lockType === 'none' && (
                        <span className="text-zinc-400 text-[11px]">None</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      {getStatusBadge(ticket.status)}
                    </td>

                    {/* Billing & Balance */}
                    <td className="py-3.5 px-4 font-mono">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          ${ticket.billing.totalAmount.toFixed(2)}
                        </p>
                        <p className={`text-[11px] ${ticket.billing.balanceDue > 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}`}>
                          {ticket.billing.balanceDue > 0 ? `Due: $${ticket.billing.balanceDue.toFixed(2)}` : '✓ Settled'}
                        </p>
                      </div>
                    </td>

                    {/* Assigned Tech */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-[10px]">
                          {ticket.technicianName.charAt(0)}
                        </div>
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[100px]">
                          {ticket.technicianName}
                        </span>
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Thermal QR Sticker Print */}
                        <button
                          onClick={() => openServiceTagModal(ticket)}
                          className="p-1.5 text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Print Thermal Service Tag (QR Code)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Invoice Receipt Print */}
                        <button
                          onClick={() => openReceiptModal(ticket, 'thermal')}
                          className="p-1.5 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Print Customer Receipt / Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Open in Tech Workbench */}
                        <button
                          onClick={() => openJobModal(ticket)}
                          className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Open Workbench"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>

                        {/* Settle POS */}
                        {ticket.billing.balanceDue > 0 && (
                          <button
                            onClick={() => setCurrentRole('pos')}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm transition-all ml-1"
                            title="Open POS to collect payment"
                          >
                            POS
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing {filteredTickets.length} of {tickets.length} total orders</span>
          <span className="text-[11px]">FixPoint FrontDesk Realtime Engine</span>
        </div>
      </div>

    </div>
  );
};

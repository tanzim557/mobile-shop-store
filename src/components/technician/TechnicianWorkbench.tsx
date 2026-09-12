import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { TicketStatus } from '../../types';
import { 
  Search, 
  Flame, 
  Boxes, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  ArrowRight,
  Wrench,
  Printer,
  CheckCircle2,
  AlertCircle,
  Lock,
  Smartphone,
  ShieldCheck,
  X,
  Star,
  Inbox,
  Cpu,
  Package,
  Grid,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface KanbanColumn {
  id: TicketStatus;
  title: string;
  subtitle: string;
  dotColor: string;
  accentBar: string;
  badgeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TechnicianWorkbench: React.FC = () => {
  const { 
    tickets, 
    technicians, 
    openJobModal, 
    updateTicketStatus,
    openServiceTagModal,
    showToast
  } = useApp();

  const [selectedTechId, setSelectedTechId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<TicketStatus | null>(null);

  const columns: KanbanColumn[] = [
    { 
      id: 'received', 
      title: 'In Queue', 
      subtitle: 'Intake & Awaiting Assignment',
      dotColor: 'bg-sky-500', 
      accentBar: 'bg-sky-500',
      badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
      icon: Inbox
    },
    { 
      id: 'diagnosing', 
      title: 'Under Diagnosis', 
      subtitle: 'Hardware & Circuit Testing',
      dotColor: 'bg-blue-500', 
      accentBar: 'bg-blue-500',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
      icon: Cpu
    },
    { 
      id: 'parts_awaited', 
      title: 'Waiting on Parts', 
      subtitle: 'Requisition & Transit Delay',
      dotColor: 'bg-amber-500', 
      accentBar: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
      icon: Package
    },
    { 
      id: 'repairing', 
      title: 'Active Repair', 
      subtitle: 'Bench Assembly & Soldering',
      dotColor: 'bg-indigo-500', 
      accentBar: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80',
      icon: Wrench
    },
    { 
      id: 'qc', 
      title: 'Quality Check (QC)', 
      subtitle: '8-Point Functional Signoff',
      dotColor: 'bg-purple-500', 
      accentBar: 'bg-purple-500',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
      icon: ShieldCheck
    },
    { 
      id: 'ready', 
      title: 'Ready for Pickup', 
      subtitle: 'Customer Notified & Stored',
      dotColor: 'bg-emerald-500', 
      accentBar: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
      icon: CheckCircle2
    },
  ];

  const statusOrder: TicketStatus[] = ['received', 'diagnosing', 'parts_awaited', 'repairing', 'qc', 'ready'];

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Exclude completed/delivered and cancelled from active workbench
      if (t.status === 'delivered' || t.status === 'cancelled') return false;

      const matchesTech = selectedTechId === 'all' || t.technicianId === selectedTechId;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q) ||
        t.device.model.toLowerCase().includes(q) ||
        t.device.brand.toLowerCase().includes(q) ||
        t.faults.some((f) => f.toLowerCase().includes(q));

      return matchesTech && matchesPriority && matchesSearch;
    });
  }, [tickets, selectedTechId, priorityFilter, searchQuery]);

  // Metric stats
  const metrics = useMemo(() => {
    const active = tickets.filter(t => t.status !== 'delivered' && t.status !== 'cancelled');
    const urgentCount = active.filter(t => t.priority === 'urgent').length;
    const benchCount = active.filter(t => t.status === 'repairing' || t.status === 'diagnosing').length;
    const partsCount = active.filter(t => t.status === 'parts_awaited').length;
    const readyCount = active.filter(t => t.status === 'ready').length;

    return {
      total: active.length,
      urgent: urgentCount,
      bench: benchCount,
      parts: partsCount,
      ready: readyCount
    };
  }, [tickets]);

  const getNextStatus = (current: TicketStatus): TicketStatus | null => {
    const idx = statusOrder.indexOf(current);
    if (idx >= 0 && idx < statusOrder.length - 1) return statusOrder[idx + 1];
    return null;
  };

  const getPrevStatus = (current: TicketStatus): TicketStatus | null => {
    const idx = statusOrder.indexOf(current);
    if (idx > 0) return statusOrder[idx - 1];
    return null;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTicketId(ticketId);
  };

  const handleDragEnd = () => {
    setDraggedTicketId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: TicketStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: TicketStatus) => {
    // Only clear if leaving the column itself
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    setDragOverColId(null);
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId;
    if (ticketId) {
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket && ticket.status !== targetStatus) {
        updateTicketStatus(ticketId, targetStatus);
        const colObj = columns.find(c => c.id === targetStatus);
        showToast(
          'Pipeline Updated', 
          `Ticket ${ticketId} moved to ${colObj?.title || targetStatus}`, 
          'success'
        );
      }
    }
    setDraggedTicketId(null);
  };

  const hasActiveFilters = selectedTechId !== 'all' || priorityFilter !== 'all' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedTechId('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5 pb-8">
      
      {/* Top Header & Analytics Bar */}
      <div className="flex flex-col gap-4">
        
        {/* Title and Top Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                Technician Workbench & Kanban Board
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <Sparkles className="w-3 h-3" /> Live Flow
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Real-time repair pipelines, hardware diagnosis logs, parts allocation, and 8-point QC signoff.
            </p>
          </div>

          {/* Filter Bar Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Technician Filter */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All Technicians</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                    {tech.name} ({tech.activeTickets} active)
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">🔥 Urgent Only</option>
                <option value="high">⚡ High Priority</option>
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, model, customer..."
                className="pl-8.5 pr-8 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 w-44 sm:w-60 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Quick Pipeline KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Active</span>
            </div>
            <span className="text-sm font-black font-mono text-zinc-900 dark:text-white">{metrics.total}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Urgent Tickets</span>
            </div>
            <span className={`text-sm font-black font-mono ${metrics.urgent > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'}`}>
              {metrics.urgent}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">On The Bench</span>
            </div>
            <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">{metrics.bench}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Package className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Awaiting Parts</span>
            </div>
            <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">{metrics.parts}</span>
          </div>

          <div className="hidden lg:flex px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ready for Pickup</span>
            </div>
            <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">{metrics.ready}</span>
          </div>
        </div>

        {/* Drag & Drop Hint */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Drag cards between lanes or use navigation arrows to move tickets through stages</span>
          </span>
          <span className="hidden sm:inline-block font-mono">
            Showing {filteredTickets.length} of {tickets.filter(t => t.status !== 'delivered' && t.status !== 'cancelled').length} tickets
          </span>
        </div>

      </div>

      {/* Kanban Board Container (Smooth horizontal scroll, zero overlap) */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[calc(100vh-290px)] select-none">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.id);
          const isDragTarget = dragOverColId === col.id;
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-[315px] min-w-[315px] max-w-[315px] shrink-0 flex flex-col rounded-2xl border transition-all duration-200 ${
                isDragTarget 
                  ? 'bg-brand-500/10 border-brand-500 shadow-glow-brand ring-2 ring-brand-500/40' 
                  : 'bg-zinc-100/75 dark:bg-zinc-950/70 border-zinc-200/90 dark:border-zinc-800/90 shadow-xs'
              }`}
            >
              {/* Column Top Accent Stripe */}
              <div className={`h-1.5 w-full rounded-t-2xl ${col.accentBar}`} />

              {/* Column Header */}
              <div className="p-3.5 pb-2.5 border-b border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <ColIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
                        {col.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border shadow-xs ${col.badgeBg}`}>
                    {colTickets.length}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 pl-1">
                  {col.subtitle}
                </p>
              </div>

              {/* Column Cards List */}
              <div className="p-2.5 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-340px)] min-h-[480px]">
                {colTickets.length === 0 ? (
                  <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800/90 rounded-xl text-center">
                    <div className="p-2.5 rounded-full bg-zinc-200/60 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 mb-2">
                      <ColIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      No tickets in lane
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Drop tickets here to update status
                    </p>
                  </div>
                ) : (
                  colTickets.map((ticket) => {
                    const prevStatus = getPrevStatus(ticket.status);
                    const nextStatus = getNextStatus(ticket.status);
                    const techObj = technicians.find(t => t.id === ticket.technicianId);
                    const isDraggingThis = draggedTicketId === ticket.id;
                    const stageIndex = statusOrder.indexOf(ticket.status);

                    return (
                      <div
                        key={ticket.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => openJobModal(ticket)}
                        className={`p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 rounded-xl shadow-xs hover:border-brand-500/60 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2.5 ${
                          isDraggingThis ? 'opacity-40 scale-95 ring-2 ring-brand-500' : ''
                        }`}
                      >
                        {/* Top: Ticket ID, Priority, VIP Badge */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                            {ticket.id}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {ticket.customer.isVip && (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                VIP
                              </span>
                            )}

                            {ticket.priority === 'urgent' && (
                              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-md animate-pulse">
                                <Flame className="w-2.5 h-2.5 text-rose-500" />
                                URGENT
                              </span>
                            )}

                            {ticket.priority === 'high' && (
                              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
                                <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                                HIGH
                              </span>
                            )}

                            {ticket.priority === 'normal' && (
                              <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                NORMAL
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Device Info & Customer Name */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                              {ticket.device.brand} {ticket.device.model}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 pl-5">
                            <span className="truncate max-w-[150px]">{ticket.customer.name}</span>
                            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate max-w-[90px]">
                              {ticket.device.color}
                            </span>
                          </div>
                        </div>

                        {/* Faults list pills */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {ticket.faults.slice(0, 2).map((fault, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 truncate max-w-[135px]"
                              title={fault}
                            >
                              {fault}
                            </span>
                          ))}
                          {ticket.faults.length > 2 && (
                            <span 
                              className="px-1.5 py-0.5 text-[9px] font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/80"
                              title={ticket.faults.slice(2).join(', ')}
                            >
                              +{ticket.faults.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Security Lock & Allocated Parts Strip */}
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80">
                          <div className="flex items-center gap-1.5">
                            {ticket.device.lockType === 'pin' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                <Lock className="w-2.5 h-2.5 text-amber-500" />
                                PIN: {ticket.device.lockCode}
                              </span>
                            )}
                            {ticket.device.lockType === 'pattern' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                <Grid className="w-2.5 h-2.5 text-indigo-500" />
                                Pattern
                              </span>
                            )}
                            {ticket.device.lockType === 'password' && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                <Lock className="w-2.5 h-2.5 text-emerald-500" />
                                Password
                              </span>
                            )}
                            {ticket.device.lockType === 'none' && (
                              <span className="text-[10px] text-zinc-400">Unlocked</span>
                            )}
                          </div>

                          {ticket.parts.length > 0 && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                              <Boxes className="w-3 h-3" />
                              <span>{ticket.parts.length} {ticket.parts.length === 1 ? 'part' : 'parts'}</span>
                            </span>
                          )}
                        </div>

                        {/* Assigned Technician & Pipeline Stage Progress */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {techObj?.avatar ? (
                              <img 
                                src={techObj.avatar} 
                                alt={ticket.technicianName} 
                                className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0" 
                              />
                            ) : (
                              <div className="w-4.5 h-4.5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                                {ticket.technicianName.charAt(0)}
                              </div>
                            )}
                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[110px]" title={ticket.technicianName}>
                              {ticket.technicianName}
                            </span>
                          </div>

                          {/* 6-Stage Progress Indicator */}
                          <div className="flex items-center gap-1" title={`Stage ${stageIndex + 1} of 6: ${col.title}`}>
                            {columns.map((c, i) => (
                              <span 
                                key={c.id} 
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  i <= stageIndex ? 'bg-brand-500' : 'bg-zinc-200 dark:bg-zinc-700'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Action Bar: Prev, Open Bench, Print Tag, Next */}
                        <div 
                          className="pt-2 flex items-center gap-1.5 border-t border-zinc-100 dark:border-zinc-800/80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatus ? (
                            <button
                              onClick={() => {
                                updateTicketStatus(ticket.id, prevStatus);
                                const prevCol = columns.find(c => c.id === prevStatus);
                                showToast('Moved Back', `Ticket moved to ${prevCol?.title}`, 'info');
                              }}
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shrink-0"
                              title={`Move back to ${columns.find(c => c.id === prevStatus)?.title}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="w-7 shrink-0" />
                          )}

                          <button
                            onClick={() => openJobModal(ticket)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/80 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-lg border border-brand-200/50 dark:border-brand-800/50 transition-all shadow-2xs group/btn"
                          >
                            <Wrench className="w-3 h-3 text-brand-500 group-hover/btn:rotate-45 transition-transform" />
                            <span>Open Bench</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>

                          <button
                            onClick={() => openServiceTagModal(ticket)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shrink-0"
                            title="Print Thermal Service Tag"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {nextStatus ? (
                            <button
                              onClick={() => {
                                updateTicketStatus(ticket.id, nextStatus);
                                const nextCol = columns.find(c => c.id === nextStatus);
                                showToast('Stage Advanced', `Ticket advanced to ${nextCol?.title}`, 'success');
                              }}
                              className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shrink-0"
                              title={`Advance to ${columns.find(c => c.id === nextStatus)?.title}`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="w-7 shrink-0" />
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

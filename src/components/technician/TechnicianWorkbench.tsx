import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TicketStatus } from '../../types';
import { 
  Search, 
  Flame, 
  Boxes, 
  ChevronRight, 
  ChevronLeft,
  User,
  ArrowRight
} from 'lucide-react';

interface KanbanColumn {
  id: TicketStatus;
  title: string;
  dotColor: string;
  badgeBg: string;
}

export const TechnicianWorkbench: React.FC = () => {
  const { 
    tickets, 
    technicians, 
    openJobModal, 
    updateTicketStatus
  } = useApp();

  const [selectedTechId, setSelectedTechId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const columns: KanbanColumn[] = [
    { id: 'received', title: 'In Queue', dotColor: 'bg-zinc-400', badgeBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' },
    { id: 'diagnosing', title: 'Under Diagnosis', dotColor: 'bg-blue-500', badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
    { id: 'parts_awaited', title: 'Waiting on Parts', dotColor: 'bg-amber-500', badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
    { id: 'repairing', title: 'Active Repair', dotColor: 'bg-indigo-500', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
    { id: 'qc', title: 'Quality Check (QC)', dotColor: 'bg-purple-500', badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' },
    { id: 'ready', title: 'Ready for Pickup', dotColor: 'bg-emerald-500', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
  ];

  const filteredTickets = tickets.filter((t) => {
    const matchesTech = selectedTechId === 'all' || t.technicianId === selectedTechId;
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.faults.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTech && matchesSearch;
  });

  const getNextStatus = (current: TicketStatus): TicketStatus | null => {
    const order: TicketStatus[] = ['received', 'diagnosing', 'parts_awaited', 'repairing', 'qc', 'ready'];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: TicketStatus): TicketStatus | null => {
    const order: TicketStatus[] = ['received', 'diagnosing', 'parts_awaited', 'repairing', 'qc', 'ready'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Technician Workbench & Kanban Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time repair pipelines, hardware diagnosis logs, parts allocation, and 8-point QC signoff.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Tech Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <User className="w-3.5 h-3.5 text-zinc-400 ml-1.5" />
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none pr-2 py-0.5"
            >
              <option value="all">All Technicians</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search board..."
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-36 sm:w-44 shadow-sm"
            />
          </div>

        </div>
      </div>

      {/* Kanban Board Horizontal Scrolling Lanes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col bg-zinc-100/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 min-w-[250px] min-h-[550px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 tracking-tight">
                    {col.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border border-zinc-200 dark:border-zinc-700 ${col.badgeBg}`}>
                  {colTickets.length}
                </span>
              </div>

              {/* Column Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                {colTickets.length === 0 ? (
                  <div className="h-28 flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-600 text-xs font-medium">
                    No tickets in lane
                  </div>
                ) : (
                  colTickets.map((ticket) => {
                    const prevStatus = getPrevStatus(ticket.status);
                    const nextStatus = getNextStatus(ticket.status);

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => openJobModal(ticket)}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 rounded-xl shadow-sm hover:border-brand-500/60 hover:shadow-md transition-all cursor-pointer group space-y-2 select-none"
                      >
                        {/* Card Top: ID & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-brand-600 dark:text-brand-400 text-xs">
                            {ticket.id}
                          </span>
                          {ticket.priority === 'urgent' && (
                            <span className="flex items-center gap-0.5 text-[9px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded">
                              <Flame className="w-2.5 h-2.5 text-rose-500" />
                              URGENT
                            </span>
                          )}
                          {ticket.priority === 'high' && (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                              HIGH
                            </span>
                          )}
                        </div>

                        {/* Device Info */}
                        <div>
                          <p className="font-bold text-xs text-zinc-900 dark:text-white leading-tight">
                            {ticket.device.brand} {ticket.device.model}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {ticket.customer.name}
                          </p>
                        </div>

                        {/* Fault tags */}
                        <div className="flex flex-wrap gap-1">
                          {ticket.faults.slice(0, 2).map((fault, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-[9px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 truncate max-w-[120px]"
                            >
                              {fault}
                            </span>
                          ))}
                        </div>

                        {/* Card Footer Info */}
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-1.5">
                            {ticket.parts.length > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-mono font-semibold">
                                <Boxes className="w-3 h-3" />
                                {ticket.parts.length}
                              </span>
                            )}
                            {ticket.device.lockType === 'pin' && (
                              <span className="font-mono text-zinc-400">PIN:{ticket.device.lockCode}</span>
                            )}
                            {ticket.device.lockType === 'pattern' && (
                              <span className="font-mono text-zinc-400">PAT</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-[8px]">
                              {ticket.technicianName.charAt(0)}
                            </div>
                            <span className="text-[10px] font-medium truncate max-w-[65px]">{ticket.technicianName.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Quick Status Forward / Backward Movement */}
                        <div 
                          className="pt-1.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatus ? (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, prevStatus)}
                              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                              title={`Move back to ${prevStatus.replace('_', ' ')}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}

                          <button
                            onClick={() => openJobModal(ticket)}
                            className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>Open Bench</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>

                          {nextStatus ? (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, nextStatus)}
                              className="p-1 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                              title={`Advance to ${nextStatus.replace('_', ' ')}`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}
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

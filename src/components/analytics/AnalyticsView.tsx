import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Star, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tickets, technicians } = useApp();

  // Metrics
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.billing.paymentStatus === 'paid' ? t.billing.totalAmount : t.billing.depositPaid), 0);
  const totalProjected = tickets.reduce((sum, t) => sum + t.billing.totalAmount, 0);
  const completedJobs = tickets.filter(t => t.status === 'delivered' || t.status === 'ready').length;
  const avgTurnaroundHours = 2.8;
  const firstTimeFixRate = 98.4;

  const weeklyData = [
    { day: 'Mon', revenue: 1420, tickets: 8 },
    { day: 'Tue', revenue: 1980, tickets: 11 },
    { day: 'Wed', revenue: 1650, tickets: 9 },
    { day: 'Thu', revenue: 2310, tickets: 14 },
    { day: 'Fri', revenue: 2890, tickets: 18 },
    { day: 'Sat', revenue: 3450, tickets: 22 },
    { day: 'Sun', revenue: 1890, tickets: 10 },
  ];

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

  const faultDistribution = [
    { label: 'OLED / Display Assemblies', percentage: 44, color: 'bg-brand-500' },
    { label: 'Battery Replacements', percentage: 24, color: 'bg-emerald-500' },
    { label: 'Charging Flex / Daughterboards', percentage: 14, color: 'bg-amber-500' },
    { label: 'Camera & Visor Glass', percentage: 10, color: 'bg-purple-500' },
    { label: 'Micro-Soldering & IC Logic', percentage: 8, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Workshop Analytics & Performance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Financial metrics, repair turnaround velocity, technician ratings, and fault distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm font-semibold">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          <span>Last 7 Days Rolling Window</span>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Settled Revenue</span>
            <span className="flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-zinc-400">Pipeline Total: ${totalProjected.toFixed(2)}</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Repairs</span>
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {completedJobs} / {tickets.length}
          </div>
          <p className="text-[11px] text-zinc-400">Active Bench Queue: {tickets.length - completedJobs}</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Turnaround</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white font-mono">
            {avgTurnaroundHours} <span className="text-sm font-sans font-normal text-zinc-500">hours</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Same-Day Fix: 88.5%</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">First-Time Fix Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {firstTimeFixRate}%
          </div>
          <p className="text-[11px] text-zinc-400">Rework claim rate: 1.6%</p>
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Fault Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Visualizer (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Daily Revenue Volume ($)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Combined labor & spare parts turnover</p>
            </div>
            <div className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
              Weekly Total: $15,590.00
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="pt-4 h-48 flex items-end justify-between gap-3 px-2">
            {weeklyData.map((d, i) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.revenue}
                  </span>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-brand-600 to-indigo-400 rounded-t-md transition-all duration-500 group-hover:from-brand-500 group-hover:to-violet-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fault Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Top Hardware Fault Categories</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Breakdown by intake frequency</p>
          </div>

          <div className="space-y-3 pt-2">
            {faultDistribution.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.label}</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200">{item.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Technician Leaderboard */}
      <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Technician Bench Leaderboard</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Output velocity, customer ratings, and active tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-start gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              <img
                src={tech.avatar}
                alt={tech.name}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate">{tech.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{tech.avgRating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold truncate">{tech.specialty}</p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 font-mono">
                  <span>{tech.completedTickets} Solved</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold">{tech.activeTickets} Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

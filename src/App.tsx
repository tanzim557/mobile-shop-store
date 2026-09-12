import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { NewTicketModal } from './components/intake/NewTicketModal';
import { ServiceTagModal } from './components/print/ServiceTagModal';
import { ReceiptModal } from './components/print/ReceiptModal';
import { JobDetailModal } from './components/technician/JobDetailModal';
import { IntakeDashboard } from './components/intake/IntakeDashboard';
import { TechnicianWorkbench } from './components/technician/TechnicianWorkbench';
import { InventoryManager } from './components/inventory/InventoryManager';
import { PosBillingView } from './components/pos/PosBillingView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TrackingPortal } from './components/public/TrackingPortal';

export const AppContent: React.FC = () => {
  const { currentRole, setCurrentRole, setTrackingSearchTicketId } = useApp();

  // Check URL parameters for deep-linking (e.g. ?track=FP-8492 from QR codes)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('track');
    if (trackId) {
      setTrackingSearchTicketId(trackId);
      setCurrentRole('public_portal');
    }
  }, [setCurrentRole, setTrackingSearchTicketId]);

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Role View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'front_desk' && <IntakeDashboard />}
        {currentRole === 'technician' && <TechnicianWorkbench />}
        {currentRole === 'inventory' && <InventoryManager />}
        {currentRole === 'pos' && <PosBillingView />}
        {currentRole === 'analytics' && <AnalyticsView />}
        {currentRole === 'public_portal' && <TrackingPortal />}
      </main>

      {/* Footer info & Keyboard Navigation guide */}
      <footer className="w-full border-t border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/60 py-3 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-700 dark:text-zinc-300">FixPoint ERP Engine v2.6</span>
            <span>• Mobile Repair & Workshop OS</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline font-medium">Quick Shortcuts:</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.2 font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700">⌘K</kbd> Command Bar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.2 font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700">N</kbd> New Ticket
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CommandPalette />
      <NewTicketModal />
      <ServiceTagModal />
      <ReceiptModal />
      <JobDetailModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return <AppContent />;
}

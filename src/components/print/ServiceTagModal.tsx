import React from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export const ServiceTagModal: React.FC = () => {
  const { isServiceTagModalOpen, setIsServiceTagModalOpen, activeTicketForTag } = useApp();

  if (!isServiceTagModalOpen || !activeTicketForTag) return null;

  const ticket = activeTicketForTag;
  const trackingUrl = `${window.location.origin}?track=${ticket.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in no-print">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Print Thermal Service Tag (50x30mm)
            </h3>
          </div>
          <button
            onClick={() => setIsServiceTagModalOpen(false)}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sticker Preview Box */}
        <div className="p-6 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-950">
          <div className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-bold">
            Standard Adhesive Label Preview
          </div>

          {/* Actual Printable Label Container */}
          <div className="printable-area w-80 bg-white text-black p-3.5 rounded-lg shadow-xl border-2 border-dashed border-zinc-300 font-sans text-xs">
            {/* Header: Shop & Ticket ID */}
            <div className="flex items-center justify-between border-b border-black/30 pb-1.5 mb-2">
              <div>
                <span className="font-black tracking-tighter text-sm uppercase">FIXPOINT WORKSHOP</span>
                <p className="text-[9px] text-zinc-600 font-mono">
                  {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-base tracking-tight bg-black text-white px-2 py-0.5 rounded">
                  {ticket.id}
                </span>
                {ticket.priority === 'urgent' && (
                  <p className="text-[9px] font-black text-red-600 uppercase">⚡ URGENT</p>
                )}
              </div>
            </div>

            {/* Middle: Device & QR */}
            <div className="flex items-start gap-3 my-2">
              <div className="flex-1">
                <p className="text-[9px] text-zinc-500 uppercase font-bold">Device Model</p>
                <p className="font-black text-xs leading-tight text-black">{ticket.device.brand} {ticket.device.model}</p>
                <p className="text-[10px] font-mono text-zinc-600 truncate mt-0.5">
                  IMEI: {ticket.device.imei}
                </p>

                <div className="mt-1.5 pt-1 border-t border-dashed border-zinc-300">
                  <p className="text-[9px] text-zinc-500 uppercase font-bold">Customer</p>
                  <p className="font-bold text-xs leading-none">{ticket.customer.name}</p>
                  <p className="text-[10px] font-mono text-zinc-700">{ticket.customer.phone}</p>
                </div>
              </div>

              {/* Genuine QR Code */}
              <div className="flex flex-col items-center bg-white p-1 rounded border border-zinc-200">
                <QRCodeSVG
                  value={trackingUrl}
                  size={68}
                  level="M"
                  includeMargin={false}
                />
                <span className="text-[8px] font-mono mt-0.5 uppercase tracking-tighter text-zinc-600 font-bold">
                  Scan to Track
                </span>
              </div>
            </div>

            {/* Lock / Security Code */}
            <div className="bg-zinc-100 p-1.5 rounded my-1.5 flex items-center justify-between border border-zinc-200">
              <span className="text-[9px] font-bold text-zinc-600 uppercase">Unlock Code:</span>
              <span className="font-mono font-black text-xs text-black">
                {ticket.device.lockType === 'pin' && `PIN: [ ${ticket.device.lockCode} ]`}
                {ticket.device.lockType === 'pattern' && `Pattern: [ ${ticket.device.lockCode} ]`}
                {ticket.device.lockType === 'none' && 'No Passcode'}
              </span>
            </div>

            {/* Fault summary */}
            <div className="text-[10px] text-zinc-800">
              <span className="font-bold text-zinc-900">Faults: </span>
              <span>{ticket.faults.join(', ')}</span>
            </div>

            {/* Bottom Bar: Tech & Est */}
            <div className="mt-2 pt-1 border-t border-black/20 flex items-center justify-between text-[9px] text-zinc-600 font-mono">
              <span>Tech: {ticket.technicianName}</span>
              <span>Est: {new Date(ticket.estimatedDelivery).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Thermal direct label roll (50x30mm)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsServiceTagModalOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm transition-all hover:shadow-glow-brand active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Search, 
  Printer, 
  CheckCircle2, 
  Share2, 
  MessageCircle, 
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const PosBillingView: React.FC = () => {
  const { 
    tickets, 
    updateBilling, 
    processPayment, 
    openReceiptModal, 
    showToast 
  } = useApp();

  const [searchTicketQuery, setSearchTicketQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(() => {
    const readyTicket = tickets.find(t => t.status === 'ready' && t.billing.balanceDue > 0) || tickets[0];
    return readyTicket ? readyTicket.id : '';
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'bank_transfer'>('card');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleLaborChange = (val: number) => {
    if (!selectedTicket) return;
    updateBilling(selectedTicket.id, { laborCost: Math.max(0, val) });
  };

  const handleDiscountChange = (val: number) => {
    if (!selectedTicket) return;
    updateBilling(selectedTicket.id, { discount: Math.max(0, val) });
  };

  const handleWaiveDiagnosticToggle = () => {
    if (!selectedTicket) return;
    updateBilling(selectedTicket.id, { 
      waiveDiagnosticFee: !selectedTicket.billing.waiveDiagnosticFee 
    });
  };

  const handleCompletePayment = () => {
    if (!selectedTicket) return;
    const amountToPay = selectedTicket.billing.balanceDue;
    if (amountToPay <= 0) {
      showToast('Already Settled', 'This ticket has no remaining balance due.', 'info');
      return;
    }

    processPayment(selectedTicket.id, paymentMethod, amountToPay);

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      openReceiptModal(selectedTicket, 'thermal');
    }, 600);
  };

  const generateWhatsAppMessage = () => {
    if (!selectedTicket) return '';
    const trackingUrl = `${window.location.origin}?track=${selectedTicket.id}`;
    return encodeURIComponent(
      `Hello ${selectedTicket.customer.name},\n\n` +
      `Your repair order #${selectedTicket.id} for ${selectedTicket.device.brand} ${selectedTicket.device.model} has been finalized at FixPoint Workshop.\n\n` +
      `• Total Amount: $${selectedTicket.billing.totalAmount.toFixed(2)}\n` +
      `• Balance Due: $${selectedTicket.billing.balanceDue.toFixed(2)}\n` +
      `• Warranty Coverage: ${selectedTicket.warrantyPeriod}\n\n` +
      `You can view your detailed digital receipt and live diagnostic warranty card here:\n${trackingUrl}\n\n` +
      `Thank you for choosing FixPoint!`
    );
  };

  const changeDue = Math.max(0, Number((cashTendered - (selectedTicket?.billing?.balanceDue || 0)).toFixed(2)));
  const pendingTickets = tickets.filter(t => t.billing.balanceDue > 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Point of Sale & Split Billing Checkout
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Auto-calculated spare parts, customizable labor fee, instant tax calculation, and WhatsApp receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-sm">
            <strong className="text-amber-600 dark:text-amber-400">{pendingTickets.length}</strong> pending orders in queue
          </span>
        </div>
      </div>

      {/* Main Grid: Ticket Selection + Billing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tickets Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3.5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2.5 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTicketQuery}
                onChange={(e) => setSearchTicketQuery(e.target.value)}
                placeholder="Search ticket # or customer..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-1">
              Select Work Order to Settle
            </p>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {tickets
                .filter(t => 
                  t.id.toLowerCase().includes(searchTicketQuery.toLowerCase()) ||
                  t.customer.name.toLowerCase().includes(searchTicketQuery.toLowerCase()) ||
                  t.device.model.toLowerCase().includes(searchTicketQuery.toLowerCase())
                )
                .map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  const isPaid = t.billing.balanceDue <= 0.01;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-50/80 dark:bg-brand-600/10 border-brand-500 ring-1 ring-brand-500/30'
                          : 'bg-zinc-50/70 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">{t.id}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          isPaid ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {isPaid ? 'PAID' : `DUE: $${t.billing.balanceDue.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-1 truncate">{t.customer.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-0.5">
                        <span>{t.device.brand} {t.device.model}</span>
                        <span className="capitalize">{t.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Split Billing & Checkout Panel (8 cols) */}
        <div className="lg:col-span-8">
          {selectedTicket ? (
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl space-y-6 p-6">
              
              {/* Ticket Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-brand-600 dark:text-brand-400 text-lg">#{selectedTicket.id}</span>
                    <span className="font-bold text-zinc-900 dark:text-white text-sm">{selectedTicket.device.brand} {selectedTicket.device.model}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                      {selectedTicket.customer.name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Phone: {selectedTicket.customer.phone} • Warranty: {selectedTicket.warrantyPeriod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Invoice</span>
                  </button>

                  <button
                    onClick={() => openReceiptModal(selectedTicket, 'thermal')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>

              {/* Split Billing Line Items */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Itemized Service Breakdown
                </h3>

                {/* 1. Spare Parts Requisitioned */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">1. Requisitioned Hardware Components</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">
                      ${selectedTicket.billing.partsCost.toFixed(2)}
                    </span>
                  </div>

                  {selectedTicket.parts.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 italic">No spare parts required (labor-only service)</p>
                  ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60 pt-1">
                      {selectedTicket.parts.map((part) => (
                        <div key={part.partId} className="py-1.5 flex items-center justify-between text-xs">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                            {part.quantity}x {part.name}
                          </span>
                          <span className="font-mono text-zinc-500 dark:text-zinc-400">
                            ${part.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Labor & Diagnostic Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                      2. Workshop Labor Charge ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedTicket.billing.laborCost}
                      onChange={(e) => handleLaborChange(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Diagnostic Inspection ($)
                      </label>
                      <button
                        type="button"
                        onClick={handleWaiveDiagnosticToggle}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          selectedTicket.billing.waiveDiagnosticFee 
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {selectedTicket.billing.waiveDiagnosticFee ? '✓ Waived' : 'Charge'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-1">
                      {selectedTicket.billing.waiveDiagnosticFee ? '$0.00 (Waived for repair)' : `$${selectedTicket.billing.diagnosticFee.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                {/* 3. Discount & Tax */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                      Promotional Discount ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedTicket.billing.discount}
                      onChange={(e) => handleDiscountChange(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                      Sales Tax / VAT ({selectedTicket.billing.taxRate}%)
                    </label>
                    <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 pt-1">
                      ${selectedTicket.billing.taxAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

              </div>

              {/* Financial Calculation Card */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Grand Total:</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200">${selectedTicket.billing.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Initial Deposit Collected:</span>
                  <span className="font-mono font-bold">-${selectedTicket.billing.depositPaid.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between items-center text-sm font-black">
                  <span className="text-zinc-900 dark:text-zinc-100">BALANCE DUE NOW:</span>
                  <span className="text-xl font-mono text-amber-600 dark:text-amber-400">
                    ${selectedTicket.billing.balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Processing Section */}
              {selectedTicket.billing.balanceDue > 0 ? (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Select Payment Method & Settle
                  </h3>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'card' as const, label: 'Card / POS' },
                      { id: 'cash' as const, label: 'Cash Tendered' },
                      { id: 'upi' as const, label: 'Apple Pay / UPI' },
                      { id: 'bank_transfer' as const, label: 'Bank Wire' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === m.id
                            ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/25'
                            : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Cash Change Calculator */}
                  {paymentMethod === 'cash' && (
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Cash Received from Customer ($):</span>
                        <input
                          type="number"
                          min={selectedTicket.billing.balanceDue}
                          value={cashTendered || ''}
                          onChange={(e) => setCashTendered(Number(e.target.value))}
                          placeholder="e.g. 100"
                          className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs font-mono font-bold text-zinc-900 dark:text-white focus:outline-none w-28"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Change Due:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
                          ${changeDue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Settle Button */}
                  <button
                    onClick={handleCompletePayment}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/25 hover:shadow-glow-emerald transition-all active:scale-98 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Collect ${selectedTicket.billing.balanceDue.toFixed(2)} & Settle Order</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Order Settled & Paid in Full</p>
                      <p className="text-[11px] text-zinc-500">Method: {selectedTicket.billing.paymentMethod?.toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openReceiptModal(selectedTicket, 'thermal')}
                    className="px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg border border-zinc-200 dark:border-zinc-700"
                  >
                    Reprint Receipt
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              Select a repair order to inspect billing.
            </div>
          )}
        </div>

      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Send Invoice via WhatsApp / SMS</h3>
              </div>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1 font-semibold">Recipient Mobile:</label>
                <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{selectedTicket.customer.phone}</p>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1 font-semibold">Message Preview:</label>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {decodeURIComponent(generateWhatsAppMessage())}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/25 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Open WhatsApp Direct</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(decodeURIComponent(generateWhatsAppMessage()));
                    showToast('Copied to Clipboard', 'Invoice text copied for SMS or email.', 'success');
                    setIsWhatsAppModalOpen(false);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  Copy Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

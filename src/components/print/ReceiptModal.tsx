import React from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { 
    isReceiptModalOpen, 
    setIsReceiptModalOpen, 
    activeTicketForReceipt,
    receiptMode,
    setReceiptMode
  } = useApp();

  if (!isReceiptModalOpen || !activeTicketForReceipt) return null;

  const ticket = activeTicketForReceipt;
  const trackingUrl = `${window.location.origin}?track=${ticket.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in no-print overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Invoice Document: <span className="font-mono text-brand-600 dark:text-brand-400">#{ticket.id}</span>
            </h3>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setReceiptMode('thermal')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  receiptMode === 'thermal' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                80mm Thermal
              </button>
              <button
                type="button"
                onClick={() => setReceiptMode('a4')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  receiptMode === 'a4' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                A4 Tax Invoice
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Container Preview */}
        <div className="p-6 bg-zinc-100 dark:bg-zinc-950 max-h-[70vh] overflow-y-auto flex justify-center">
          
          {/* MODE 1: 80mm THERMAL RECEIPT */}
          {receiptMode === 'thermal' && (
            <div className="printable-area w-80 bg-white text-black p-5 rounded-md shadow-xl font-mono text-xs border border-zinc-300 space-y-3">
              <div className="text-center border-b border-black/30 pb-3">
                <p className="font-black text-base tracking-wider uppercase font-sans">FIXPOINT WORKSHOP</p>
                <p className="text-[10px] text-zinc-600">544 Tech Avenue, Silicon Plaza, Suite 201</p>
                <p className="text-[10px] text-zinc-600">Phone: +1 (800) 555-FIXP | GST: 82-948190-TX</p>
                <div className="mt-2 font-bold text-sm bg-black text-white py-0.5 rounded">
                  SERVICE RECEIPT #{ticket.id}
                </div>
              </div>

              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Date:</span>
                  <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Customer:</span>
                  <span className="font-bold">{ticket.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Phone:</span>
                  <span>{ticket.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Device:</span>
                  <span className="font-bold">{ticket.device.brand} {ticket.device.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">IMEI:</span>
                  <span className="text-[10px]">{ticket.device.imei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Tech:</span>
                  <span>{ticket.technicianName}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-b border-dashed border-black/40 py-2 space-y-1 text-[11px]">
                <div className="flex justify-between font-bold border-b border-zinc-300 pb-1">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {ticket.parts.map((p) => (
                  <div key={p.partId} className="flex justify-between">
                    <span>{p.quantity}x {p.name.slice(0, 20)}...</span>
                    <span>${p.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Labor & Bench Diagnostics</span>
                  <span>${ticket.billing.laborCost.toFixed(2)}</span>
                </div>
                {!ticket.billing.waiveDiagnosticFee && ticket.billing.diagnosticFee > 0 && (
                  <div className="flex justify-between">
                    <span>Diagnostic Inspection Fee</span>
                    <span>${ticket.billing.diagnosticFee.toFixed(2)}</span>
                  </div>
                )}
                {ticket.billing.discount > 0 && (
                  <div className="flex justify-between text-zinc-700">
                    <span>Promotional Discount</span>
                    <span>-${ticket.billing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 text-[10px]">
                  <span>Sales Tax ({ticket.billing.taxRate}%)</span>
                  <span>${ticket.billing.taxAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL AMOUNT:</span>
                  <span>${ticket.billing.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Deposit Paid:</span>
                  <span>-${ticket.billing.depositPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm bg-zinc-100 p-1.5 rounded">
                  <span>BALANCE DUE:</span>
                  <span>${ticket.billing.balanceDue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>Payment Status:</span>
                  <span className="uppercase font-bold">{ticket.billing.paymentStatus}</span>
                </div>
              </div>

              {/* QR & Warranty */}
              <div className="border-t border-black/30 pt-3 text-center space-y-2">
                <div className="flex justify-center">
                  <QRCodeSVG value={trackingUrl} size={64} />
                </div>
                <p className="text-[9px] text-zinc-500 font-sans">
                  Warranty: <strong>{ticket.warrantyPeriod}</strong>
                </p>
                <p className="text-[8px] text-zinc-500 uppercase leading-tight font-sans">
                  Repairs guaranteed against defect for stated duration. Physical or water damage after handover voids warranty.
                </p>
                <p className="text-[9px] font-bold">Thank you for choosing FixPoint ERP!</p>
              </div>
            </div>
          )}

          {/* MODE 2: FORMAL A4 TAX INVOICE */}
          {receiptMode === 'a4' && (
            <div className="printable-area w-full max-w-xl bg-white text-black p-8 rounded-lg shadow-xl font-sans text-xs border border-zinc-300 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-300 pb-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-zinc-900">FixPoint Workshop Systems</h1>
                  <p className="text-xs text-zinc-600 mt-1">High-Precision Mobile Hardware & Diagnostics</p>
                  <p className="text-xs text-zinc-500 mt-0.5">544 Tech Avenue, Suite 201, Silicon Plaza, CA</p>
                  <p className="text-xs text-zinc-500">VAT / Tax ID: US-9284102-FX</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-zinc-900 text-white font-mono font-bold text-sm rounded">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold mt-2">Invoice #: {ticket.id}</p>
                  <p className="text-xs text-zinc-500">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bill To & Device Info Grid */}
              <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Customer Details</p>
                  <p className="font-bold text-sm text-zinc-900 mt-1">{ticket.customer.name}</p>
                  <p className="text-xs text-zinc-700">{ticket.customer.phone}</p>
                  {ticket.customer.email && <p className="text-xs text-zinc-600">{ticket.customer.email}</p>}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Serviced Device Specs</p>
                  <p className="font-bold text-sm text-zinc-900 mt-1">{ticket.device.brand} {ticket.device.model}</p>
                  <p className="text-xs font-mono text-zinc-700">IMEI: {ticket.device.imei}</p>
                  <p className="text-xs text-zinc-600">Assigned Tech: {ticket.technicianName}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-zinc-800 text-[10px] font-bold text-zinc-600 uppercase">
                      <th className="py-2">Item / Service Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-xs">
                    {ticket.parts.map((p) => (
                      <tr key={p.partId}>
                        <td className="py-2.5">
                          <p className="font-semibold text-zinc-800">{p.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500">SKU: {p.sku}</p>
                        </td>
                        <td className="py-2.5 text-center font-mono">{p.quantity}</td>
                        <td className="py-2.5 text-right font-mono">${p.unitPrice.toFixed(2)}</td>
                        <td className="py-2.5 text-right font-mono font-semibold">${p.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-2.5">
                        <p className="font-semibold text-zinc-800">Precision Labor & Workshop Bench Service</p>
                        <p className="text-[10px] text-zinc-500">Disassembly, soldering, micro-inspection & 8-point QC check</p>
                      </td>
                      <td className="py-2.5 text-center font-mono">1</td>
                      <td className="py-2.5 text-right font-mono">${ticket.billing.laborCost.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-mono font-semibold">${ticket.billing.laborCost.toFixed(2)}</td>
                    </tr>
                    {!ticket.billing.waiveDiagnosticFee && ticket.billing.diagnosticFee > 0 && (
                      <tr>
                        <td className="py-2.5 text-zinc-800">Diagnostic Inspection Fee</td>
                        <td className="py-2.5 text-center font-mono">1</td>
                        <td className="py-2.5 text-right font-mono">${ticket.billing.diagnosticFee.toFixed(2)}</td>
                        <td className="py-2.5 text-right font-mono font-semibold">${ticket.billing.diagnosticFee.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Parts & Labor Subtotal:</span>
                    <span className="font-mono">${(ticket.billing.partsCost + ticket.billing.laborCost).toFixed(2)}</span>
                  </div>
                  {ticket.billing.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Applied Discount:</span>
                      <span className="font-mono">-${ticket.billing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Sales Tax / VAT ({ticket.billing.taxRate}%):</span>
                    <span className="font-mono">${ticket.billing.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t border-zinc-300 pt-1 text-zinc-900">
                    <span>Total Amount:</span>
                    <span className="font-mono">${ticket.billing.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Deposit Collected:</span>
                    <span className="font-mono">-${ticket.billing.depositPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm bg-zinc-100 p-1.5 rounded text-zinc-900">
                    <span>Balance Due:</span>
                    <span className="font-mono">${ticket.billing.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Warranty & Signature Footer */}
              <div className="border-t border-zinc-200 pt-4 grid grid-cols-2 gap-6 items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Official Warranty Coverage</p>
                  <p className="font-bold text-zinc-900">{ticket.warrantyPeriod}</p>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    Warranty covers replaced components and workshop workmanship.
                  </p>
                </div>
                <div className="text-right space-y-3">
                  <div className="border-b border-zinc-400 w-48 ml-auto pb-1 text-center font-serif italic text-zinc-800">
                    {ticket.technicianName}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Authorized Technician Signature</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

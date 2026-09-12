import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { QcChecklist } from '../../types';
import { 
  X, 
  Wrench, 
  Boxes, 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Send,
  ArrowRight,
  Printer
} from 'lucide-react';

export const JobDetailModal: React.FC = () => {
  const { 
    isJobModalOpen, 
    setIsJobModalOpen, 
    activeTicketForJob, 
    parts, 
    updateTicketStatus, 
    addTechnicianDiagnosis, 
    requisitionPartToTicket, 
    removePartFromTicket,
    updateQcChecklist,
    openServiceTagModal,
    openReceiptModal
  } = useApp();

  const [notes, setNotes] = useState('');
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'parts' | 'qc' | 'timeline'>('diagnosis');

  if (!isJobModalOpen || !activeTicketForJob) return null;

  const ticket = activeTicketForJob;

  const handleSaveNotes = () => {
    if (notes.trim()) {
      addTechnicianDiagnosis(ticket.id, (ticket.technicianNotes ? ticket.technicianNotes + '\n' : '') + notes);
      setNotes('');
    }
  };

  const handleRequisitionPart = () => {
    if (!selectedPartId) return;
    const success = requisitionPartToTicket(ticket.id, selectedPartId, partQty);
    if (success) {
      setSelectedPartId('');
      setPartQty(1);
    }
  };

  const qcItems: { key: keyof QcChecklist; label: string; desc: string }[] = [
    { key: 'displayTouch', label: 'Display & Touch Matrix', desc: 'Verify multi-touch points, 120Hz refresh, no dead pixels' },
    { key: 'batteryCharging', label: 'Battery & Fast Charge', desc: 'Current draw test (>15W), temperature stability, battery health' },
    { key: 'frontCamera', label: 'Front Camera & Sensors', desc: 'Selfie camera focus, ambient light sensor, proximity shutoff' },
    { key: 'rearCamera', label: 'Rear Camera Array & OIS', desc: 'Primary 50MP sensor, optical image stabilization, ultra-wide & zoom' },
    { key: 'speakerEarpiece', label: 'Stereo Speakers & Earpiece', desc: 'Loudspeaker clarity at 100% volume, bottom acoustic mesh test' },
    { key: 'microphone', label: 'Microphones (Noise Cancel)', desc: 'Primary voice mic, secondary video mic, noise suppression' },
    { key: 'wifiBluetooth', label: 'WiFi, Cellular & Bluetooth', desc: '5GHz band signal strength, cellular SIM latch, BT peripheral pairing' },
    { key: 'biometrics', label: 'Biometrics & Security', desc: 'FaceID TrueDepth dot projector or under-display optical fingerprint' },
  ];

  const passedQcCount = Object.values(ticket.qc).filter(Boolean).length;
  const qcPercentage = Math.round((passedQcCount / 8) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-brand-600 dark:text-brand-400 text-base">#{ticket.id}</span>
                <span className="font-bold text-zinc-900 dark:text-white text-sm">
                  {ticket.device.brand} {ticket.device.model}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ticket.priority === 'urgent' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Customer: {ticket.customer.name} • {ticket.customer.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openServiceTagModal(ticket)}
              className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Print Service Tag Sticker"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Device Quick Specs & Passcode Banner */}
        <div className="px-6 py-3 bg-zinc-100/60 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold block uppercase">IMEI / Serial</span>
              <span className="font-mono font-medium">{ticket.device.imei}</span>
            </div>
            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-800" />
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold block uppercase">Security Passcode</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {ticket.device.lockType === 'pin' && `PIN: ${ticket.device.lockCode}`}
                {ticket.device.lockType === 'pattern' && `Pattern: ${ticket.device.lockCode}`}
                {ticket.device.lockType === 'none' && 'None'}
              </span>
            </div>
            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-800" />
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold block uppercase">Assigned Tech</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{ticket.technicianName}</span>
            </div>
          </div>

          {/* QC Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">QC Pass:</span>
            <div className="w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${qcPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{passedQcCount}/8</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 flex gap-2 pt-2 bg-zinc-50/50 dark:bg-zinc-950/20">
          {[
            { id: 'diagnosis', label: 'Diagnosis & Notes', icon: <Wrench className="w-3.5 h-3.5" /> },
            { id: 'parts', label: `Spare Parts (${ticket.parts.length})`, icon: <Boxes className="w-3.5 h-3.5" /> },
            { id: 'qc', label: `QC Checklist (${passedQcCount}/8)`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
            { id: 'timeline', label: 'Audit Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 dark:border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: DIAGNOSIS & LOGS */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Reported Faults & Complaints
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ticket.faults.map((fault, i) => (
                    <span key={i} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
                      ⚠️ {fault}
                    </span>
                  ))}
                </div>
              </div>

              {ticket.customerNotes && (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Customer Statement</span>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">"{ticket.customerNotes}"</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Technician Diagnostic Bench Log
                </label>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-zinc-800 dark:text-zinc-300 min-h-[80px] whitespace-pre-line">
                  {ticket.technicianNotes || 'No technical notes recorded yet.'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Append Diagnosis Observation
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNotes()}
                    placeholder="e.g. Ultrasonic cleaning complete, VCC_MAIN short cleared..."
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPARE PARTS REQUISITION */}
          {activeTab === 'parts' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Requisition Spare Part from Workshop Inventory</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="">-- Select Spare Part from Catalog --</option>
                    {parts.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stockQty === 0}>
                        {p.name} ({p.sku}) — Stock: {p.stockQty} | ${p.sellingPrice.toFixed(2)} {p.stockQty === 0 ? '(OUT)' : ''}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-center text-zinc-900 dark:text-zinc-100 font-mono font-bold"
                    />
                    <button
                      onClick={handleRequisitionPart}
                      disabled={!selectedPartId}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition-colors whitespace-nowrap shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Allocate</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* List of requisitioned parts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold uppercase tracking-wider text-[11px]">Assigned Components</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    Parts Total: ${ticket.billing.partsCost.toFixed(2)}
                  </span>
                </div>

                {ticket.parts.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-400 text-xs">
                    No spare parts allocated yet to this repair ticket.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/60">
                    {ticket.parts.map((p) => (
                      <div key={p.partId} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500">
                            SKU: {p.sku} • {p.quantity} x ${p.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                            ${p.totalPrice.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removePartFromTicket(ticket.id, p.partId)}
                            className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                            title="Return to inventory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 8-POINT QUALITY CONTROL CHECKLIST */}
          {activeTab === 'qc' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Pre-Delivery Hardware Verification</h4>
                  <p className="text-[11px] text-zinc-500">All 8 items must pass before marking device Ready for Pickup</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    qcItems.forEach(item => updateQcChecklist(ticket.id, item.key, true));
                  }}
                  className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                >
                  ✓ Pass All 8 Checkpoints
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {qcItems.map((item) => {
                  const isChecked = ticket.qc[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => updateQcChecklist(ticket.id, item.key, !isChecked)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold ${
                        isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${isChecked ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-5">
                {ticket.timeline.map((entry) => (
                  <div key={entry.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white dark:ring-zinc-900" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{entry.title}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{entry.description}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-mono">By: {entry.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer: State Transitions */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Stage:</span>
            <span className="capitalize font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              {ticket.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ticket.status === 'received' && (
              <button
                onClick={() => updateTicketStatus(ticket.id, 'diagnosing', 'Assigned to bench for deep hardware diagnosis')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                <span>Start Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {ticket.status === 'diagnosing' && (
              <>
                <button
                  onClick={() => updateTicketStatus(ticket.id, 'parts_awaited', 'Awaiting OEM replacement parts')}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg"
                >
                  Need Parts
                </button>
                <button
                  onClick={() => updateTicketStatus(ticket.id, 'repairing', 'Parts available; hardware repair active')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm"
                >
                  <span>Start Repair</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {ticket.status === 'parts_awaited' && (
              <button
                onClick={() => updateTicketStatus(ticket.id, 'repairing', 'Spare parts in bench; assembly active')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                <span>Parts Ready; Start Repair</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {ticket.status === 'repairing' && (
              <button
                onClick={() => {
                  updateTicketStatus(ticket.id, 'qc', 'Hardware assembled; under 8-point QC checklist');
                  setActiveTab('qc');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm"
              >
                <span>Send to QC Testing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {ticket.status === 'qc' && (
              <button
                onClick={() => updateTicketStatus(ticket.id, 'ready', 'Passed all 8 QC steps; customer notified')}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-glow-emerald"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Fixed & Ready</span>
              </button>
            )}

            {ticket.status === 'ready' && (
              <button
                onClick={() => openReceiptModal(ticket, 'thermal')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm"
              >
                <span>Print Handover Receipt</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

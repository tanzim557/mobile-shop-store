import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatternLockSelector } from './PatternLockSelector';
import { COMMON_FAULTS, POPULAR_BRANDS } from '../../data/mockData';
import type { LockType, TicketPriority } from '../../types';
import { 
  X, 
  User, 
  Smartphone, 
  AlertCircle, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Sparkles,
  Printer,
  ShieldCheck,
  Check
} from 'lucide-react';

export const NewTicketModal: React.FC = () => {
  const { 
    isNewTicketModalOpen, 
    setIsNewTicketModalOpen, 
    addTicket, 
    technicians, 
    openServiceTagModal 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [isVip, setIsVip] = useState(false);

  // Step 2: Device
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [imei, setImei] = useState('');
  const [color, setColor] = useState('');
  const [lockType, setLockType] = useState<LockType>('pin');
  const [lockCode, setLockCode] = useState('1234');
  const [hasScreenProtector, setHasScreenProtector] = useState(false);
  const [hasSimCard, setHasSimCard] = useState(true);

  // Step 3: Faults & Cosmetic
  const [selectedFaults, setSelectedFaults] = useState<string[]>(['Cracked Display OLED']);
  const [customerNotes, setCustomerNotes] = useState('');
  const [scratches, setScratches] = useState<'none' | 'minor' | 'heavy'>('minor');
  const [dents, setDents] = useState<'none' | 'minor' | 'heavy'>('none');
  const [waterDamaged, setWaterDamaged] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Step 4: Quotation & Technician
  const [estimatedLabor, setEstimatedLabor] = useState(75);
  const [diagnosticFee, setDiagnosticFee] = useState(25);
  const [waiveDiagnostic, setWaiveDiagnostic] = useState(true);
  const [depositPaid, setDepositPaid] = useState(50);
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || 'tech-1');
  const [estimatedHours, setEstimatedHours] = useState(24);

  if (!isNewTicketModalOpen) return null;

  const toggleFault = (fault: string) => {
    if (selectedFaults.includes(fault)) {
      setSelectedFaults(selectedFaults.filter((f) => f !== fault));
    } else {
      setSelectedFaults([...selectedFaults, fault]);
    }
  };

  const handleSimulatePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setPhotoPreview(picked);
  };

  const generateRandomImei = () => {
    let result = '35';
    for (let i = 0; i < 13; i++) {
      result += Math.floor(Math.random() * 10);
    }
    setImei(result);
  };

  const handleFillQuickSample = () => {
    setCustomerName('Marcus Vance');
    setPhone('+1 (555) 392-8819');
    setAlternatePhone('+1 (555) 771-0021');
    setEmail('marcus.vance@techfirm.co');
    setBrand('Apple');
    setModel('iPhone 15 Pro');
    setColor('Natural Titanium');
    setImei('358912301982345');
    setLockType('pin');
    setLockCode('9988');
    setSelectedFaults(['Cracked Display OLED', 'Battery Drains Rapidly']);
    setCustomerNotes('Screen shattered on concrete floor. Urgent repair needed for business trip.');
    setDepositPaid(80);
    setPriority('high');
    setPhotoPreview('https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80');
  };

  const handleSubmit = (autoPrintTag = true) => {
    const selectedTech = technicians.find((t) => t.id === technicianId) || technicians[0];
    const deliveryDate = new Date(Date.now() + estimatedHours * 3600 * 1000).toISOString();

    const subtotal = estimatedLabor + (waiveDiagnostic ? 0 : diagnosticFee);
    const tax = Number(((subtotal * 8.25) / 100).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const balance = Math.max(0, Number((total - depositPaid).toFixed(2)));

    const createdTicket = addTicket({
      estimatedDelivery: deliveryDate,
      status: 'received',
      priority,
      customer: {
        id: `cust-${Date.now()}`,
        name: customerName || 'Walk-in Customer',
        phone: phone || '+1 (555) 000-0000',
        alternatePhone,
        email,
        isVip,
      },
      device: {
        brand,
        model: model || `${brand} Device`,
        imei: imei || '350000000000000',
        color: color || 'Standard',
        lockType,
        lockCode,
        hasScreenProtector,
        hasSimCard,
      },
      faults: selectedFaults.length > 0 ? selectedFaults : ['General Diagnosis'],
      customerNotes,
      technicianNotes: 'Device checked in at counter. Queued for diagnostic evaluation.',
      photos: photoPreview ? [photoPreview] : [],
      cosmeticCondition: {
        scratches,
        dents,
        crackedBack: false,
        waterDamaged,
      },
      technicianId: selectedTech.id,
      technicianName: selectedTech.name,
      parts: [],
      billing: {
        partsCost: 0,
        laborCost: estimatedLabor,
        diagnosticFee,
        waiveDiagnosticFee: waiveDiagnostic,
        discount: 0,
        taxRate: 8.25,
        taxAmount: tax,
        totalAmount: total,
        depositPaid,
        balanceDue: balance,
        paymentStatus: depositPaid >= total ? 'paid' : depositPaid > 0 ? 'partial' : 'unpaid',
        paymentMethod: depositPaid > 0 ? 'card' : undefined,
      },
      warrantyPeriod: '90 Days FixPoint Shield',
      qc: {
        displayTouch: false,
        batteryCharging: false,
        frontCamera: false,
        rearCamera: false,
        speakerEarpiece: false,
        microphone: false,
        wifiBluetooth: false,
        biometrics: false,
      },
    });

    setIsNewTicketModalOpen(false);

    if (autoPrintTag) {
      openServiceTagModal(createdTicket);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                New Repair Ticket Intake
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Register device, record unlock pattern, log faults & issue service tag
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillQuickSample}
              className="px-2.5 py-1 text-[11px] font-semibold text-brand-600 dark:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-lg transition-colors flex items-center gap-1"
              title="Auto-fill sample data for demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Fill Sample</span>
            </button>
            <button
              onClick={() => setIsNewTicketModalOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-3 bg-zinc-100/70 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-4 gap-2">
          {[
            { num: 1, label: 'Customer', icon: <User className="w-3.5 h-3.5" /> },
            { num: 2, label: 'Device & Lock', icon: <Smartphone className="w-3.5 h-3.5" /> },
            { num: 3, label: 'Faults & QC', icon: <AlertCircle className="w-3.5 h-3.5" /> },
            { num: 4, label: 'Estimate', icon: <DollarSign className="w-3.5 h-3.5" /> },
          ].map((s) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  isCurrent
                    ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent 
                    ? 'bg-brand-600 text-white' 
                    : isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* STEP 1: CUSTOMER DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Vance"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alternate Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="+1 (555) 987-6543 (optional)"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address (for e-Receipt)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="david.vance@example.com"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              {/* VIP Account Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">VIP / Corporate Priority Account</p>
                  <p className="text-[11px] text-zinc-500">Flags ticket with express bench turnaround and high visibility</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVip(!isVip)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isVip ? 'bg-brand-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      isVip ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DEVICE & LOCK */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Device Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Model Name / Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max or Galaxy S24 Ultra"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      IMEI / Serial Number
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomImei}
                      className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                    >
                      Generate Sample
                    </button>
                  </div>
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="15-digit IMEI or Serial"
                    maxLength={18}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Color / Finish
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Natural Titanium, Phantom Black"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              {/* Physical Accessories */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={hasSimCard}
                    onChange={(e) => setHasSimCard(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-brand-600 focus:ring-brand-500/30"
                  />
                  <span>Physical SIM Card Retained</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={hasScreenProtector}
                    onChange={(e) => setHasScreenProtector(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-brand-600 focus:ring-brand-500/30"
                  />
                  <span>Screen Protector Installed</span>
                </label>
              </div>

              {/* Security Credentials with Interactive Pattern */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                  Screen Unlock Credentials (Mandatory for QC diagnostic signoff)
                </label>
                <PatternLockSelector
                  lockType={lockType}
                  lockCode={lockCode}
                  onChange={(t, c) => {
                    setLockType(t);
                    setLockCode(c);
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: FAULTS & COSMETIC */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                  Reported Faults & Symptoms (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_FAULTS.map((fault) => {
                    const isSelected = selectedFaults.includes(fault);
                    return (
                      <button
                        key={fault}
                        type="button"
                        onClick={() => toggleFault(fault)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-400'
                            : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{fault}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Physical Condition Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Frame Scratches / Wear
                  </label>
                  <select
                    value={scratches}
                    onChange={(e) => setScratches(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="none">Flawless / Pristine</option>
                    <option value="minor">Minor Surface Hairlines</option>
                    <option value="heavy">Heavy Scratches / Scuffs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Corner Dents / Impact
                  </label>
                  <select
                    value={dents}
                    onChange={(e) => setDents(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="none">No Dents</option>
                    <option value="minor">Minor Corner Nick</option>
                    <option value="heavy">Severe Bezel Deformation</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Liquid / Water Ingress</span>
                    <p className="text-[10px] text-zinc-500">Triggers emergency battery disconnection protocol</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={waterDamaged}
                    onChange={(e) => setWaterDamaged(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-rose-600 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Customer Notes / Symptoms Detail
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Explain under what circumstances the issue occurs (e.g. dropped on asphalt, sound crackles at high volume)..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              {/* Photo Preview Simulator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Device Intake Condition Photo
                  </label>
                  <button
                    type="button"
                    onClick={handleSimulatePhoto}
                    className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{photoPreview ? 'Change Photo' : 'Attach Photo Proof'}</span>
                  </button>
                </div>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 h-28 w-full bg-zinc-950">
                    <img
                      src={photoPreview}
                      alt="Device preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-black/80 text-white rounded-md hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={handleSimulatePhoto}
                    className="border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-xl p-4 text-center cursor-pointer bg-zinc-50 dark:bg-zinc-950/40 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
                    <p className="text-xs text-zinc-500">Click to attach intake cosmetic photo proof</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: ESTIMATE & DISPATCH */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Estimated Labor Service Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedLabor}
                    onChange={(e) => setEstimatedLabor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Initial Deposit Paid ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Assign Technician
                  </label>
                  <select
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Repair Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none"
                  >
                    <option value="low">Low (Routine)</option>
                    <option value="normal">Normal (Standard 24-48h)</option>
                    <option value="high">High (Priority)</option>
                    <option value="urgent">Urgent / VIP (Express Bench)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Diagnostic Inspection:</span>
                  <span className={waiveDiagnostic ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}>
                    ${diagnosticFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Estimated Labor:</span>
                  <span className="text-zinc-800 dark:text-zinc-200">${estimatedLabor.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Sales Tax (8.25%):</span>
                  <span className="text-zinc-800 dark:text-zinc-200">
                    ${(((estimatedLabor + (waiveDiagnostic ? 0 : diagnosticFee)) * 8.25) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex items-center justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  <span>Total Estimate:</span>
                  <span className="text-brand-600 dark:text-brand-400 font-mono">
                    ${((estimatedLabor + (waiveDiagnostic ? 0 : diagnosticFee)) * 1.0825).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  <span>Deposit Collected:</span>
                  <span>-${depositPaid.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-700 dark:text-brand-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-500" />
                <span>
                  Creating this ticket registers the job, routes it to the technician's board, and creates a live QR tracking record.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !customerName) {
                    setCustomerName('Walk-in Customer');
                  }
                  if (step === 2 && !model) {
                    setModel(`${brand} Device`);
                  }
                  setStep((step + 1) as any);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all hover:shadow-glow-brand"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-glow-emerald transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Create & Print Service Tag</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

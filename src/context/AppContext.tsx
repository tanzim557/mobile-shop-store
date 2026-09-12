import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  RepairTicket, 
  SparePart, 
  Technician, 
  UserRole, 
  TicketStatus, 
  QcChecklist, 
  BillingDetails, 
  RequisitionedPart,
  TimelineEntry
} from '../types';
import { INITIAL_PARTS, INITIAL_TECHNICIANS, INITIAL_TICKETS } from '../data/mockData';

export interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  tickets: RepairTicket[];
  parts: SparePart[];
  technicians: Technician[];

  // Ticket Operations
  addTicket: (newTicket: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => RepairTicket;
  updateTicket: (id: string, updates: Partial<RepairTicket>) => void;
  updateTicketStatus: (id: string, newStatus: TicketStatus, customNote?: string) => void;
  addTechnicianDiagnosis: (id: string, notes: string) => void;
  requisitionPartToTicket: (ticketId: string, partId: string, quantity?: number) => boolean;
  removePartFromTicket: (ticketId: string, partId: string) => void;
  updateQcChecklist: (ticketId: string, qcKey: keyof QcChecklist, value: boolean) => void;
  updateBilling: (ticketId: string, updates: Partial<BillingDetails>) => void;
  processPayment: (ticketId: string, method: 'cash' | 'card' | 'upi' | 'bank_transfer', amount: number) => void;

  // Inventory Operations
  addPart: (part: Omit<SparePart, 'id'>) => void;
  adjustPartStock: (partId: string, delta: number) => void;
  updatePart: (partId: string, updates: Partial<SparePart>) => void;

  // Modal State
  isNewTicketModalOpen: boolean;
  setIsNewTicketModalOpen: (open: boolean) => void;
  
  isServiceTagModalOpen: boolean;
  setIsServiceTagModalOpen: (open: boolean) => void;
  activeTicketForTag: RepairTicket | null;
  openServiceTagModal: (ticket: RepairTicket) => void;

  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  activeTicketForReceipt: RepairTicket | null;
  receiptMode: 'thermal' | 'a4';
  setReceiptMode: (mode: 'thermal' | 'a4') => void;
  openReceiptModal: (ticket: RepairTicket, mode?: 'thermal' | 'a4') => void;

  isJobModalOpen: boolean;
  setIsJobModalOpen: (open: boolean) => void;
  activeTicketForJob: RepairTicket | null;
  openJobModal: (ticket: RepairTicket) => void;

  isCmdPaletteOpen: boolean;
  setIsCmdPaletteOpen: (open: boolean) => void;

  trackingSearchTicketId: string;
  setTrackingSearchTicketId: (id: string) => void;

  // Toast Alerts
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Utilities
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('fixpoint_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('fixpoint_theme', t);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Current Role
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('fixpoint_role');
    return (saved as UserRole) || 'front_desk';
  });

  useEffect(() => {
    localStorage.setItem('fixpoint_role', currentRole);
  }, [currentRole]);

  // Tickets state
  const [tickets, setTickets] = useState<RepairTicket[]>(() => {
    const saved = localStorage.getItem('fixpoint_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('fixpoint_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Parts state
  const [parts, setParts] = useState<SparePart[]>(() => {
    const saved = localStorage.getItem('fixpoint_parts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_PARTS;
  });

  useEffect(() => {
    localStorage.setItem('fixpoint_parts', JSON.stringify(parts));
  }, [parts]);

  // Technicians state
  const [technicians] = useState<Technician[]>(INITIAL_TECHNICIANS);

  // Modals state
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isServiceTagModalOpen, setIsServiceTagModalOpen] = useState(false);
  const [activeTicketForTag, setActiveTicketForTag] = useState<RepairTicket | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeTicketForReceipt, setActiveTicketForReceipt] = useState<RepairTicket | null>(null);
  const [receiptMode, setReceiptMode] = useState<'thermal' | 'a4'>('thermal');

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [activeTicketForJob, setActiveTicketForJob] = useState<RepairTicket | null>(null);

  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [trackingSearchTicketId, setTrackingSearchTicketId] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener (CMD+K / Ctrl+K and N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
      } else if (!isInput && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsNewTicketModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Operations
  const openServiceTagModal = (ticket: RepairTicket) => {
    setActiveTicketForTag(ticket);
    setIsServiceTagModalOpen(true);
  };

  const openReceiptModal = (ticket: RepairTicket, mode: 'thermal' | 'a4' = 'thermal') => {
    setActiveTicketForReceipt(ticket);
    setReceiptMode(mode);
    setIsReceiptModalOpen(true);
  };

  const openJobModal = (ticket: RepairTicket) => {
    setActiveTicketForJob(ticket);
    setIsJobModalOpen(true);
  };

  const addTicket = (newTicketData: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): RepairTicket => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `FP-${randNum}`;
    const now = new Date().toISOString();

    const createdTimeline: TimelineEntry = {
      id: `tl-${Date.now()}`,
      timestamp: now,
      status: 'received',
      title: 'Ticket Created & Device Intake Logged',
      description: `Intake recorded by Front Desk. Initial diagnosis in queue.`,
      actor: 'Front Desk Counter',
    };

    const createdTicket: RepairTicket = {
      ...newTicketData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      timeline: [createdTimeline],
    };

    setTickets((prev) => [createdTicket, ...prev]);
    showToast('Ticket Created Successfully', `Service Ticket ${newId} has been registered and tagged.`, 'success');
    return createdTicket;
  };

  const updateTicket = (id: string, updates: Partial<RepairTicket>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          if (activeTicketForJob?.id === id) setActiveTicketForJob(updated);
          if (activeTicketForTag?.id === id) setActiveTicketForTag(updated);
          if (activeTicketForReceipt?.id === id) setActiveTicketForReceipt(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (id: string, newStatus: TicketStatus, customNote?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const now = new Date().toISOString();
          const statusLabels: Record<TicketStatus, string> = {
            received: 'Device Intake / In Queue',
            diagnosing: 'Under Diagnostic Inspection',
            parts_awaited: 'Waiting for OEM Spare Parts',
            repairing: 'Active Hardware Repair',
            qc: 'Quality Control & Diagnostics',
            ready: 'Repair Completed & Ready for Pickup',
            delivered: 'Device Delivered & Settled',
            cancelled: 'Service Cancelled',
          };

          const newTimelineEntry: TimelineEntry = {
            id: `tl-${Date.now()}`,
            timestamp: now,
            status: newStatus,
            title: `Status Changed to ${statusLabels[newStatus]}`,
            description: customNote || `Ticket status updated to ${newStatus} by technician team.`,
            actor: t.technicianName || 'Workshop Staff',
          };

          const updated: RepairTicket = {
            ...t,
            status: newStatus,
            updatedAt: now,
            timeline: [...t.timeline, newTimelineEntry],
          };

          if (activeTicketForJob?.id === id) setActiveTicketForJob(updated);
          if (activeTicketForTag?.id === id) setActiveTicketForTag(updated);
          if (activeTicketForReceipt?.id === id) setActiveTicketForReceipt(updated);
          return updated;
        }
        return t;
      })
    );
    showToast('Status Updated', `Ticket #${id} moved to ${newStatus.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const addTechnicianDiagnosis = (id: string, notes: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const now = new Date().toISOString();
          const updated = {
            ...t,
            technicianNotes: notes,
            updatedAt: now,
          };
          if (activeTicketForJob?.id === id) setActiveTicketForJob(updated);
          return updated;
        }
        return t;
      })
    );
    showToast('Diagnosis Saved', `Technical notes recorded for ticket #${id}`, 'success');
  };

  const requisitionPartToTicket = (ticketId: string, partId: string, quantity: number = 1): boolean => {
    const targetPart = parts.find((p) => p.id === partId);
    if (!targetPart) return false;

    if (targetPart.stockQty < quantity) {
      showToast('Insufficient Stock', `Only ${targetPart.stockQty} units of ${targetPart.name} available.`, 'error');
      return false;
    }

    // Deduct stock from inventory
    adjustPartStock(partId, -quantity);

    // Add or increment in ticket parts
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const existingPartIndex = ticket.parts.findIndex((p) => p.partId === partId);
          let updatedParts: RequisitionedPart[];

          if (existingPartIndex >= 0) {
            updatedParts = ticket.parts.map((p, idx) => {
              if (idx === existingPartIndex) {
                const newQty = p.quantity + quantity;
                return {
                  ...p,
                  quantity: newQty,
                  totalPrice: newQty * p.unitPrice,
                };
              }
              return p;
            });
          } else {
            updatedParts = [
              ...ticket.parts,
              {
                partId: targetPart.id,
                sku: targetPart.sku,
                name: targetPart.name,
                quantity,
                unitPrice: targetPart.sellingPrice,
                totalPrice: targetPart.sellingPrice * quantity,
              },
            ];
          }

          // Recalculate billing
          const partsCost = updatedParts.reduce((sum, p) => sum + p.totalPrice, 0);
          const subtotal = partsCost + ticket.billing.laborCost + (ticket.billing.waiveDiagnosticFee ? 0 : ticket.billing.diagnosticFee) - ticket.billing.discount;
          const taxAmount = Number(((subtotal * ticket.billing.taxRate) / 100).toFixed(2));
          const totalAmount = Number((subtotal + taxAmount).toFixed(2));
          const balanceDue = Number((totalAmount - ticket.billing.depositPaid).toFixed(2));

          const updatedTicket: RepairTicket = {
            ...ticket,
            parts: updatedParts,
            billing: {
              ...ticket.billing,
              partsCost,
              taxAmount,
              totalAmount,
              balanceDue,
            },
            updatedAt: new Date().toISOString(),
          };

          if (activeTicketForJob?.id === ticketId) setActiveTicketForJob(updatedTicket);
          return updatedTicket;
        }
        return ticket;
      })
    );

    showToast('Part Allocated', `Allocated ${quantity}x ${targetPart.name} to ticket #${ticketId}.`, 'success');
    return true;
  };

  const removePartFromTicket = (ticketId: string, partId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const requisitioned = ticket.parts.find((p) => p.partId === partId);
    if (!requisitioned) return;

    // Return stock back to inventory
    adjustPartStock(partId, requisitioned.quantity);

    // Remove from ticket
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedParts = t.parts.filter((p) => p.partId !== partId);
          const partsCost = updatedParts.reduce((sum, p) => sum + p.totalPrice, 0);
          const subtotal = partsCost + t.billing.laborCost + (t.billing.waiveDiagnosticFee ? 0 : t.billing.diagnosticFee) - t.billing.discount;
          const taxAmount = Number(((subtotal * t.billing.taxRate) / 100).toFixed(2));
          const totalAmount = Number((subtotal + taxAmount).toFixed(2));
          const balanceDue = Number((totalAmount - t.billing.depositPaid).toFixed(2));

          const updatedTicket: RepairTicket = {
            ...t,
            parts: updatedParts,
            billing: {
              ...t.billing,
              partsCost,
              taxAmount,
              totalAmount,
              balanceDue,
            },
            updatedAt: new Date().toISOString(),
          };

          if (activeTicketForJob?.id === ticketId) setActiveTicketForJob(updatedTicket);
          return updatedTicket;
        }
        return t;
      })
    );

    showToast('Part Returned', `Returned ${requisitioned.name} back to inventory.`, 'info');
  };

  const updateQcChecklist = (ticketId: string, qcKey: keyof QcChecklist, value: boolean) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedQc = { ...t.qc, [qcKey]: value };
          const updated = {
            ...t,
            qc: updatedQc,
            updatedAt: new Date().toISOString(),
          };
          if (activeTicketForJob?.id === ticketId) setActiveTicketForJob(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const updateBilling = (ticketId: string, updates: Partial<BillingDetails>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const current = { ...t.billing, ...updates };
          const partsCost = current.partsCost;
          const laborCost = current.laborCost;
          const diagFee = current.waiveDiagnosticFee ? 0 : current.diagnosticFee;
          const discount = current.discount;
          const subtotal = Math.max(0, partsCost + laborCost + diagFee - discount);
          const taxAmount = Number(((subtotal * current.taxRate) / 100).toFixed(2));
          const totalAmount = Number((subtotal + taxAmount).toFixed(2));
          const balanceDue = Math.max(0, Number((totalAmount - current.depositPaid).toFixed(2)));

          const updated = {
            ...t,
            billing: {
              ...current,
              taxAmount,
              totalAmount,
              balanceDue,
            },
            updatedAt: new Date().toISOString(),
          };

          if (activeTicketForReceipt?.id === ticketId) setActiveTicketForReceipt(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const processPayment = (ticketId: string, method: 'cash' | 'card' | 'upi' | 'bank_transfer', amount: number) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newDeposit = t.billing.depositPaid + amount;
          const balanceDue = Math.max(0, Number((t.billing.totalAmount - newDeposit).toFixed(2)));
          const paymentStatus = balanceDue <= 0.01 ? 'paid' : 'partial';

          const now = new Date().toISOString();
          const paymentTimeline: TimelineEntry = {
            id: `tl-${Date.now()}`,
            timestamp: now,
            status: t.status,
            title: `Payment Processed: $${amount.toFixed(2)} (${method.toUpperCase()})`,
            description: paymentStatus === 'paid' ? 'Account balance settled in full.' : `Remaining balance due: $${balanceDue.toFixed(2)}`,
            actor: 'POS Counter',
          };

          const updated: RepairTicket = {
            ...t,
            billing: {
              ...t.billing,
              depositPaid: newDeposit,
              balanceDue,
              paymentStatus,
              paymentMethod: method,
              paidAt: paymentStatus === 'paid' ? now : t.billing.paidAt,
            },
            status: paymentStatus === 'paid' && t.status === 'ready' ? 'delivered' : t.status,
            timeline: [...t.timeline, paymentTimeline],
            updatedAt: now,
          };

          if (activeTicketForReceipt?.id === ticketId) setActiveTicketForReceipt(updated);
          return updated;
        }
        return t;
      })
    );

    showToast('Payment Recorded', `Received payment of $${amount.toFixed(2)} via ${method.toUpperCase()}.`, 'success');
  };

  // Inventory operations
  const addPart = (partData: Omit<SparePart, 'id'>) => {
    const id = `prt-${Math.floor(100 + Math.random() * 900)}`;
    const newPart: SparePart = { ...partData, id };
    setParts((prev) => [newPart, ...prev]);
    showToast('Part Added', `${newPart.name} added to inventory.`, 'success');
  };

  const adjustPartStock = (partId: string, delta: number) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const nextStock = Math.max(0, p.stockQty + delta);
          return { ...p, stockQty: nextStock };
        }
        return p;
      })
    );
  };

  const updatePart = (partId: string, updates: Partial<SparePart>) => {
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, ...updates } : p))
    );
    showToast('Part Updated', 'Inventory records updated.', 'info');
  };

  const resetToDemoData = () => {
    localStorage.removeItem('fixpoint_tickets');
    localStorage.removeItem('fixpoint_parts');
    setTickets(INITIAL_TICKETS);
    setParts(INITIAL_PARTS);
    showToast('Demo Data Reset', 'Restored pristine sample tickets and inventory records.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        tickets,
        parts,
        technicians,
        addTicket,
        updateTicket,
        updateTicketStatus,
        addTechnicianDiagnosis,
        requisitionPartToTicket,
        removePartFromTicket,
        updateQcChecklist,
        updateBilling,
        processPayment,
        addPart,
        adjustPartStock,
        updatePart,
        isNewTicketModalOpen,
        setIsNewTicketModalOpen,
        isServiceTagModalOpen,
        setIsServiceTagModalOpen,
        activeTicketForTag,
        openServiceTagModal,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        activeTicketForReceipt,
        receiptMode,
        setReceiptMode,
        openReceiptModal,
        isJobModalOpen,
        setIsJobModalOpen,
        activeTicketForJob,
        openJobModal,
        isCmdPaletteOpen,
        setIsCmdPaletteOpen,
        trackingSearchTicketId,
        setTrackingSearchTicketId,
        toasts,
        showToast,
        dismissToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

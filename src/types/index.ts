export type TicketStatus = 
  | 'received'
  | 'diagnosing'
  | 'parts_awaited'
  | 'repairing'
  | 'qc'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  isVip?: boolean;
}

export type LockType = 'pin' | 'pattern' | 'none' | 'password';

export interface DeviceInfo {
  brand: string;
  model: string;
  imei: string;
  color: string;
  lockType: LockType;
  lockCode?: string; // e.g. "1-4-7-8-9" for pattern or "1234" for PIN
  hasScreenProtector?: boolean;
  hasSimCard?: boolean;
  hasSdCard?: boolean;
}

export interface FaultItem {
  id: string;
  label: string;
  category: 'screen' | 'battery' | 'board' | 'audio' | 'camera' | 'charging' | 'housing' | 'other';
}

export interface RequisitionedPart {
  partId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BillingDetails {
  partsCost: number;
  laborCost: number;
  diagnosticFee: number;
  waiveDiagnosticFee: boolean;
  discount: number; // in dollars
  taxRate: number; // percentage, e.g. 8.25
  taxAmount: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'bank_transfer';
  paidAt?: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  status: TicketStatus;
  title: string;
  description: string;
  actor: string;
}

export interface QcChecklist {
  displayTouch: boolean;
  batteryCharging: boolean;
  frontCamera: boolean;
  rearCamera: boolean;
  speakerEarpiece: boolean;
  microphone: boolean;
  wifiBluetooth: boolean;
  biometrics: boolean;
}

export interface RepairTicket {
  id: string; // e.g. "FP-8492"
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer: Customer;
  device: DeviceInfo;
  faults: string[];
  customerNotes?: string;
  technicianNotes?: string;
  photos?: string[];
  cosmeticCondition: {
    scratches: 'none' | 'minor' | 'heavy';
    dents: 'none' | 'minor' | 'heavy';
    crackedBack: boolean;
    waterDamaged: boolean;
  };
  technicianId: string;
  technicianName: string;
  parts: RequisitionedPart[];
  billing: BillingDetails;
  warrantyPeriod: string; // e.g. "90 Days FixPoint Shield"
  qc: QcChecklist;
  timeline: TimelineEntry[];
}

export interface SparePart {
  id: string;
  sku: string;
  name: string;
  category: 'Display' | 'Battery' | 'Charging Port' | 'Camera' | 'Housing' | 'Motherboard IC' | 'Speaker/Mic';
  compatibleModels: string[];
  stockQty: number;
  minThreshold: number;
  buyingPrice: number;
  sellingPrice: number;
  supplier: string;
  locationBin: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatar: string;
  activeTickets: number;
  completedTickets: number;
  avgRating: number;
  specialty: string;
}

export type UserRole = 'front_desk' | 'technician' | 'inventory' | 'pos' | 'analytics' | 'public_portal';

export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Engagement'
  | 'Anniversary'
  | 'Baby shower'
  | 'Graduation'
  | 'College festival'
  | 'Community event'
  | 'Corporate gathering'
  | 'Cultural festival'
  | 'Custom event';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

export type BookingStatus =
  | 'To Research'
  | 'Contacted'
  | 'Awaiting Quote'
  | 'Shortlisted'
  | 'Negotiating'
  | 'Booked'
  | 'Completed'
  | 'Cancelled';

export type RSVPStatus = 'Attending' | 'Pending' | 'Declined';
export type InvitationDeliveryStatus = 'Draft' | 'Sent' | 'Opened';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface EventConcept {
  title: string;
  description: string;
  colorPalette: ColorSwatch[];
  decorationIdeas: string[];
  lightingIdeas: string[];
  entertainmentIdeas: string[];
  guestExperience: string[];
  culturalNotes: string;
  practicalTips: string;
}

export interface ScheduleItem {
  id?: string;
  time: string;
  title: string;
  description: string;
  category: string;
}

export interface BudgetCategory {
  id?: string;
  category: string;
  estimatedCost: number;
  percentage: number;
  reasoning: string;
  lowerCostAlternative: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  name: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  vendorName?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  category: string;
  status: TaskStatus;
  dependencies?: string[];
}

export interface VendorQuotation {
  id: string;
  vendorName: string;
  totalPrice: number;
  includedServices: string[];
  exclusions: string[];
  deposit: number;
  cancellationTerms: string;
  paymentSchedule: string;
  additionalCharges: string;
  notes?: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: string;
  serviceArea?: string;
  contactInfo: string;
  description: string;
  quotedPrice?: number;
  bookingStatus: BookingStatus;
  paymentStatus?: PaymentStatus;
  quotations: VendorQuotation[];
  notes?: string;
  contractRef?: string;
  followUpDate?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  contact: string;
  attendeesCount: number;
  invitationStatus: InvitationDeliveryStatus;
  rsvpStatus: RSVPStatus;
  dietary: string;
  seatingGroup: string;
  accessibility: string;
  notes?: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  colorPalette: ColorSwatch[];
  suitableEvents: string[];
  indicativeBudget: string;
  isSaved?: boolean;
}

export interface MoodBoard {
  id: string;
  name: string;
  description: string;
  inspirationIds: string[];
  createdAt: string;
}

export interface InvitationConfig {
  templateId: string;
  title: string;
  hostNames: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  rsvpDetails: string;
  language: string;
  colorTheme: string;
  font: string;
  decorativeBorder: string;
}

export interface RiskItem {
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  contingency: string;
}

export interface VendorRequirement {
  category: string;
  selectionCriteria: string;
  suggestedQuestions: string[];
  bookingDeadline: string;
}

export interface EventPlan {
  id: string;
  name: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  venue: string;
  isOutdoor: boolean;
  guestCount: number;
  duration: string;
  preferredLanguage: string;
  culturalPreferences: string;
  currency: CurrencyCode;
  budget: {
    total: number;
    categories: BudgetCategory[];
    expenses: ExpenseItem[];
    emergencyReserve: number;
  };
  styleTheme: string;
  priorities: string[];
  concept: EventConcept;
  schedule: ScheduleItem[];
  checklist: TaskItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
  inspiration: InspirationItem[];
  moodBoards: MoodBoard[];
  invitation: InvitationConfig;
  risks: RiskItem[];
  vendorRequirements: VendorRequirement[];
  sustainability: string[];
  notes: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

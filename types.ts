
export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  level: string;
  image: string;
  upcomingDates: string[];
  prerequisites?: string[];
  isGwo?: boolean;
  modules?: string[];
  code?: string;
  certificationName?: string;
  validityMonths?: number;
  whatYouWillLearn?: string[];
  entryRequirements?: string[];
  targetAudience?: string[];
  rtoCode?: string;
  deliveryMode?: string;
  accreditedUnits?: string[];
  whatToBring?: string[];
  depositAmount?: number;
  // Collapsible Rich-Text Sections
  courseBenefits?: string;
  isThisCourseForMe?: string;
  careerOpportunities?: string;
  durationOfTraining?: string;
  whereDelivered?: string;
  accreditedUnitsRich?: string;
  entryRequirementsRich?: string;
  lln?: string;
  assessment?: string;
  certificationRecord?: string;
  validityPeriod?: string;
  whatToBringRich?: string;
  costOfTraining?: string;
  paymentOptions?: string;
}

export enum CourseCategory {
  GWO = 'Global Wind Organisation',
  CONSTRUCTION = 'Construction & High Risk Work',
  RESCUE = 'Specialised Rescue',
  SAFETY = 'Workplace Safety & Emergency Response',
  FIRST_AID = 'First Aid',
  WORKSAFE = 'WorkSafe-Approved Courses',
  ELECTRICAL = 'Electrical & Utilities',
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  coordinates: { lat: number; lng: number };
  state: 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'ACT' | 'TAS' | 'NT';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Review {
  id: string;
  courseId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface StudentDocument {
  id: string;
  name: string; // e.g., "Birth Certificate", "USI Transcripts"
  type: 'Identity' | 'Academic' | 'Medical' | 'Other';
  status: 'Pending' | 'Verified' | 'Rejected' | 'Missing';
  url?: string;
  uploadedDate?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  usi?: string; // Unique Student Identifier
  windaId?: string; // GWO ID
  employer?: string;
  enrolledCourseId: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Withdrawn' | 'Rejected' | 'Waitlisted';
  progress: number;
  certificates?: Certificate[];
  // New Fields
  sectionId?: string;
  documents?: StudentDocument[];
  financialStatus?: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  balanceDue?: number;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialties: CourseCategory[];
  qualifications: string[]; // e.g. TAE40116
  isActive: boolean;
}

export interface Session {
  id: string;
  courseId: string;
  trainerId: string;
  locationId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledStudentIds: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Certificate {
  id: string;
  code: string; // e.g., HLTAID011
  issueDate: string;
  expiryDate?: string;
  pdfUrl?: string;
}

export interface CorporateClient {
  id: string;
  companyName: string;
  abn: string;
  contactPerson: string;
  email: string;
  contractStatus: 'Active' | 'Expired' | 'Pending';
  studentCount: number;
}

export interface InstituteSettings {
  instituteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  rtoId: string;
  operatingHours: string;
  siteAnnouncement: string;
  // Enrollment Settings
  currentTerm?: string;
  enrollmentOpen?: boolean;
  enrollmentDeadline?: string;
  // New Branding & Extra Settings
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  defaultDarkMode?: boolean;
  brandColor?: string;
  themePreset?: 'navy' | 'dark' | 'emerald' | 'crimson';
  taxId?: string;
  supportContactName?: string;
  supportHours?: string;
  tuitionCurrency?: string;
  classSizeLimit?: number;
  passingScore?: number;
}

// --- Admin Settings Types ---
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
}

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'Core' | 'Add-on' | 'Beta';
}

// --- Data Migration Types ---

export interface MigrationLog {
  id: string;
  date: string;
  type: 'Students' | 'Trainers' | 'Courses' | 'History';
  status: 'Success' | 'Failed' | 'Partial';
  recordsProcessed: number;
  errors: string[];
  fileName: string;
}

export interface ImportFieldMapping {
  sourceField: string; // Header in CSV
  targetField: string; // Field in System
  required: boolean;
}

// --- Website CMS Types ---

export interface PageSectionItem {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  buttonText?: string;
  buttonLink?: string;
  specialties?: string;
  experience?: string;
}

export interface PageSection {
  id: string;
  label: string; // e.g. "Hero Section"
  type: 'hero' | 'content' | 'features' | 'cta' | 'team' | 'course-list' | 'accordion';
  data: {
    heading?: string;
    subheading?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonLink?: string;
    items?: PageSectionItem[];
    partners?: string[]; // Added for partner logos
  };
}

export interface ThemeSettings {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorSurface: string;
  fontSans: string;
  fontHeading: string;
  borderRadius: number; // in pixels (base)
  baseFontSize: number; // in pixels (default 16)
}

export interface SitePage {
  id: string; // 'home', 'about', etc.
  name: string;
  lastUpdated: string;
  sections: PageSection[];
  themeOverrides?: Partial<ThemeSettings>;
}

// --- New Features Types ---

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: 'Tuition' | 'Material Fee' | 'Deposit';
  method: 'Credit Card' | 'Bank Transfer' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed';
  invoiceId: string;
}

export interface SchoolSection {
  id: string;
  name: string; // e.g. "GWO-A1"
  courseId: string;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  trainerId?: string;
}

export interface SupportTicket {
  id: string;
  studentId: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  dateCreated: string;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  adminName: string;
  timestamp: string;
  module: string;
}

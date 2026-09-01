
export interface CourseAccordionSection {
  id: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
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
  deliveryMode?: string;
  whatToBring?: string[];
  depositAmount?: number;
  // Dynamic Collapsible Accordion Sections
  accordionSections?: CourseAccordionSection[];
  // Legacy Collapsible Rich-Text Sections (for backward compatibility)
  courseBenefits?: string;
  isThisCourseForMe?: string;
  careerOpportunities?: string;
  durationOfTraining?: string;
  whereDelivered?: string;
  entryRequirementsRich?: string;
  assessment?: string;
  certificationRecord?: string;
  validityPeriod?: string;
  whatToBringRich?: string;
  costOfTraining?: string;
  paymentOptions?: string;
  gwoModules?: string[];
  gwoModulesRich?: string;
  languageRequirements?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating?: number; // 1 to 5 stars
  source?: 'Google' | 'Manual' | 'Website';
  status?: 'Approved' | 'Pending' | 'Hidden';
  isFeatured?: boolean;
  date?: string;
  googleReviewId?: string;
  locationName?: string;
}

export interface GoogleReviewSettings {
  apiKey: string;
  placeId: string;
  autoSync: boolean;
  minimumRating: number; // e.g. 4 or 5
  lastSyncedAt?: string;
}

export interface LocationFacility {
  label: string;
  desc: string;
  icon?: string;
}

export interface LocationFaq {
  q: string;
  a: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  coordinates: { lat: number; lng: number };
  state: string;
  badge?: string;
  googleMapsUrl?: string;
  aboutDescription?: string;
  facilities?: LocationFacility[];
  faqs?: LocationFaq[];
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogChartDataPoint {
  label: string;
  value: number;
  formattedValue: string;
  color?: string;
  description?: string;
}

export interface BlogChart {
  title: string;
  subtitle?: string;
  type: 'bar' | 'donut' | 'metric-grid' | 'comparison';
  data: BlogChartDataPoint[];
}

export interface BlogContentSection {
  heading: string;
  paragraphs: string[];
  callout?: {
    type: 'tip' | 'warning' | 'quote' | 'stat';
    title: string;
    text: string;
  };
  listItems?: string[];
  image?: string;
  caption?: string;
}

export interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime?: string;
  author?: BlogAuthor;
  tags?: string[];
  keyTakeaways?: string[];
  stats?: { label: string; value: string; sublabel?: string }[];
  charts?: BlogChart[];
  contentSections?: BlogContentSection[];
  relatedCourseIds?: string[];
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
  name: string; // e.g., "Birth Certificate", "WINDA Delegate Records"
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
  photoUrl?: string;
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
  specialties: string[];
  qualifications: string[]; // e.g. GWO Instructor Certification
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
  code: string; // e.g., GWO-BST-01
  issueDate: string;
  expiryDate?: string;
  pdfUrl?: string;
}

export interface CorporateClient {
  id: string;
  companyName: string;
  taxId: string;
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
  operatingHours: string;
  siteAnnouncement: string;
  // Enrollment Settings
  currentTerm?: string;
  enrollmentOpen?: boolean;
  enrollmentDeadline?: string;
  // New Branding & Extra Settings
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  loadingLogoUrl?: string;
  faviconUrl?: string;
  collapsedLogoUrl?: string;
  uncollapsedLogoUrl?: string;
  defaultDarkMode?: boolean;
  brandColor?: string;
  themePreset?: 'navy' | 'dark' | 'emerald' | 'crimson';
  accentColor?: string;
  borderRadius?: number;
  sidebarTheme?: 'dark' | 'light' | 'color';
  taxId?: string;
  supportContactName?: string;
  fontFamily?: string;
  animationSpeed?: 'fast' | 'smooth' | 'disabled';
  layoutStyle?: 'boxed' | 'wide';
  customCss?: string;
  supportHours?: string;
  tuitionCurrency?: string;
  classSizeLimit?: number;
  passingScore?: number;
  footerDescription?: string;
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
  permissions?: string[];
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
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  badge?: string;
  tag?: string;
  location?: string;
  fallback?: string;
  buttonText?: string;
  buttonLink?: string;
  specialties?: string;
  experience?: string;
  bio?: string;
  certifications?: string;
  courses?: string;
  category?: string;
  tags?: string[];
  relatedCourseIds?: string[];
  keyPoints?: string[];
  helpfulCount?: number;
}

export interface PageSection {
  id: string;
  label: string; // e.g. "Hero Section"
  type: 'hero' | 'content' | 'features' | 'cta' | 'team' | 'course-list' | 'accordion' | 'training-programs' | 'locations-list' | 'contact-form';
  data: {
    heading?: string;
    subheading?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    badgeTitle?: string;
    badgeDescription?: string;
    programTag?: string;
    programTitle?: string;
    badge1?: string;
    badge2?: string;
    validityLabel?: string;
    validityText?: string;
    items?: PageSectionItem[];
    modules?: PageSectionItem[];
    slides?: PageSectionItem[];
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
  adminReply?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  adminName: string;
  timestamp: string;
  module: string;
}

export interface CourseInquiry {
  id: string;
  referenceCode: string;
  studentName: string;
  email: string;
  phone: string;
  company?: string;
  courseId?: string;
  courseTitle: string;
  location: string;
  preferredDate?: string;
  participantsCount: string;
  participants?: string;
  message?: string;
  status: 'New' | 'Pending' | 'Contacted' | 'Quoted' | 'Resolved' | 'Archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  enableNotifications: boolean;
  adminNotificationEmail: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  inquiryRef?: string;
  status: 'Sent' | 'Failed' | 'Queued';
  timestamp: string;
  errorDetails?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Student' | 'Admin' | 'Enrollment' | 'Certification' | 'Reminder';
  subject: string;
  headline: string;
  badgeText?: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
  footerNote?: string;
  updatedAt?: string;
}


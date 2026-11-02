
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
  totalReviewsCount?: number;
  averageRating?: number;
  placeUrl?: string;
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
  courseId?: string;
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
  mainLogoUrl?: string;
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  stickyLogoUrl?: string;
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
  badgeVariant?: 'gold' | 'amber' | 'blue' | 'emerald' | 'rose' | 'slate';
  badgePulse?: boolean;
  badgeIcon?: string;
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
    badge?: string;
    badgeVariant?: 'gold' | 'amber' | 'blue' | 'emerald' | 'rose' | 'slate';
    badgePulse?: boolean;
    badgeIcon?: string;
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

export interface SmtpHandshakeStep {
  id: 'dns' | 'socket' | 'tls' | 'auth' | 'ping';
  label: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'warning';
  message: string;
  latencyMs?: number;
  details?: string;
}

export interface SmtpTestResult {
  success: boolean;
  message: string;
  steps: SmtpHandshakeStep[];
  totalLatencyMs?: number;
  serverBanner?: string;
  testedAt: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  encryption?: 'TLS' | 'SSL' | 'None';
  enableNotifications: boolean;
  adminNotificationEmail: string;
  isConfigured?: boolean;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed';
  lastLatencyMs?: number;
  lastTestDetails?: string;
}

export interface EmailEnvelopeDetails {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  contentType: string;
  date: string;
  host: string;
  port: number;
  encryption: string;
  authSender: string;
  rawHeaders?: string;
  rawHtml?: string;
  plainText?: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  inquiryRef?: string;
  templateId?: string;
  templateName?: string;
  category?: string;
  status: 'Sent' | 'Failed' | 'Queued' | 'Pending';
  timestamp: string;
  errorDetails?: string;
  payloadSize?: number;
  envelope?: EmailEnvelopeDetails;
  deliveryMode?: 'live_smtp_relay' | 'api_gateway' | 'simulated_handshake';
}

export type EmailTemplateCategory = 
  | 'Student'
  | 'Admin'
  | 'Contact'
  | 'Inquiry'
  | 'Enrollment'
  | 'Course Enrollment'
  | 'Course Completion'
  | 'Certification'
  | 'Reminder'
  | 'Welcome'
  | 'Verification'
  | 'Password Reset'
  | 'Password Changed'
  | 'Account Created'
  | 'Account Approved'
  | 'Account Suspended'
  | 'Login Notification'
  | 'Security Alert'
  | 'Payment'
  | 'Invoice'
  | 'System'
  | 'Custom';

export type EmailTemplateStatus = 'Active' | 'Draft' | 'Inactive';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: EmailTemplateCategory;
  subject: string;
  headline: string;
  badgeText?: string;
  body: string;
  plainText?: string;
  senderName?: string;
  replyToEmail?: string;
  status: EmailTemplateStatus;
  buttonText?: string;
  buttonUrl?: string;
  footerNote?: string;
  isSystemDefault?: boolean;
  updatedAt?: string;
}

// ==========================================
// ENTERPRISE SYSTEM SETTINGS & CONFIG CENTER
// ==========================================

export type SettingsTabId =
  | 'branding'
  | 'general'
  | 'company'
  | 'contacts'
  | 'payment-links'
  | 'payment-billing'
  | 'smtp'
  | 'email-templates'
  | 'notifications'
  | 'platform'
  | 'users-roles'
  | 'security'
  | 'authentication'
  | 'permissions'
  | 'api-integrations'
  | 'storage'
  | 'cdn'
  | 'database-backup'
  | 'seo'
  | 'localization'
  | 'tax-financial'
  | 'maintenance'
  | 'audit-logs'
  | 'advanced';

export interface ExtendedLogoItem {
  id: string;
  name: string;
  type: 'main' | 'light' | 'dark' | 'sticky' | 'loading' | 'mobile' | 'favicon' | 'login' | 'email' | 'invoice' | 'admin';
  url: string;
  recommendedSize: string;
  description: string;
  dimensions?: string;
  format?: string;
  sizeBytes?: number;
  updatedAt?: string;
  active: boolean;
}

export interface ContactProfile {
  id: string;
  department: 'General Contact' | 'Sales' | 'Accounting' | 'Support' | 'Technical Support' | 'Management';
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  position: string;
  status: 'Active' | 'Inactive';
  notifyEvents: string[]; // Event IDs this contact receives notifications for
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  code: 'gcash' | 'maya' | 'stripe' | 'paypal' | 'bank_transfer' | 'custom';
  enabled: boolean;
  sandboxMode: boolean;
  accountId: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  webhookSecret: string;
  transactionFeePercent: number;
  transactionFeeFixed: number;
  currency: string;
  paymentInstructions: string;
  isDefault: boolean;
  qrCodeUrl?: string;
  lastTestedAt?: string;
  testStatus?: 'success' | 'failed' | 'untested';
  testMessage?: string;
}

export interface NotificationEventRule {
  id: string;
  eventName: string;
  category: 'Billing' | 'Enrollment' | 'Security' | 'System' | 'Course';
  email: boolean;
  inApp: boolean;
  sms: boolean;
  push: boolean;
  adminAlert: boolean;
  customerAlert: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  keyMasked: string;
  secretMasked: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  status: 'Active' | 'Revoked' | 'Expired';
  createdBy: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  secretMasked: string;
  status: 'Active' | 'Paused' | 'Failing';
  lastDeliveredAt?: string;
  failureCount: number;
}

export interface StorageConfig {
  provider: 'local' | 'firebase' | 's3' | 'bunny';
  maxFileSizeMb: number;
  allowedFileTypes: string[];
  autoWebpConversion: boolean;
  generateThumbnails: boolean;
  imageCompressionQuality: number;
  storageQuotaGb: number;
  tempFileRetentionDays: number;
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
}

export interface CdnConfig {
  provider: 'Cloudflare' | 'BunnyCDN' | 'AWS CloudFront' | 'Disabled';
  enabled: boolean;
  cdnUrl: string;
  pullZone: string;
  apiKey: string;
  cacheTtlHours: number;
  enableGzip: boolean;
  enableBrotli: boolean;
  autoPurgeOnAssetChange: boolean;
  lastPurgedAt?: string;
  status: 'Connected' | 'Error' | 'Idle';
}

export interface DatabaseBackupRecord {
  id: string;
  timestamp: string;
  sizeBytes: number;
  fileName: string;
  type: 'Automatic' | 'Manual' | 'Pre-Migration';
  checksum: string;
  storageLocation: 'Local' | 'Firebase' | 'Cloud';
  status: 'Completed' | 'Pending' | 'Failed';
  versionTag: string;
}

export interface TaxRateRule {
  id: string;
  name: string;
  ratePercent: number;
  type: 'VAT' | 'Withholding' | 'Standard' | 'Exempt';
  isDefault: boolean;
  description: string;
}

export interface ConfigVersionSnapshot {
  versionId: string;
  timestamp: string;
  changedBy: string;
  changeSummary: string;
  affectedModules: string[];
  settingsSnapshot: any;
}

export interface ExtendedSystemSettings {
  // 1. Branding
  logos: ExtendedLogoItem[];
  brandColor: string;
  accentColor: string;
  borderRadius: number;
  sidebarTheme: 'dark' | 'light' | 'color';
  themePreset: 'navy' | 'dark' | 'emerald' | 'crimson';

  // 2. General
  applicationName: string;
  applicationDescription: string;
  websiteUrl: string;
  defaultLanguage: string;
  defaultCurrency: string;
  defaultCountry: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: 'Monday' | 'Sunday';
  measurementUnit: 'Metric' | 'Imperial';
  numberFormat: '1,234.56' | '1.234,56' | '1 234,56';
  siteAnnouncement: string;

  // 3. Company Information
  companyLegalName: string;
  companyTradingName: string;
  registrationNumber: string;
  taxIdentificationNumber: string;
  addressLine: string;
  city: string;
  provinceState: string;
  country: string;
  zipCode: string;
  phone: string;
  mobilePhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyDescription: string;
  businessHours: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  termsAndConditionsUrl?: string;
  privacyPolicyUrl?: string;

  // 4. Contact Profiles
  contactProfiles: ContactProfile[];

  // 5. Payments & Gateways
  paymentGateways: PaymentGatewayConfig[];

  // 6. SMTP & Email
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: 'tls' | 'ssl' | 'none';
  smtpUsername: string;
  smtpPasswordMasked: string;
  smtpFromName: string;
  smtpFromEmail: string;
  smtpReplyToEmail: string;
  smtpCc: string;
  smtpBcc: string;

  // 7. Notification Rules
  notificationRules: NotificationEventRule[];

  // 8. Platform Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowNewRegistrations: boolean;
  allowGuestAccess: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  passwordExpirationDays: number;
  defaultUserRole: string;
  defaultPaginationSize: number;
  fileUploadLimitMb: number;
  maxRequestSizeMb: number;

  // 9. Security & Authentication
  twoFactorRequired: boolean;
  bruteForceProtection: boolean;
  accountLockoutDurationMinutes: number;
  allowedIpList: string[];
  blockedIpList: string[];
  passwordMinLength: number;
  passwordRequireSpecial: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireUppercase: boolean;
  passwordHistoryLimit: number;
  forceLogoutAllSessions: boolean;

  // 10. API & Integrations
  apiKeys: ApiKeyItem[];
  webhooks: WebhookSubscription[];

  // 11. Storage & Media
  storage: StorageConfig;

  // 12. CDN
  cdn: CdnConfig;

  // 13. Database & Backup
  backupSchedule: 'Daily' | 'Weekly' | 'Monthly' | 'Manual';
  backupRetentionDays: number;
  cloudBackupEnabled: boolean;
  backupEncryptionEnabled: boolean;
  backups: DatabaseBackupRecord[];

  // 14. SEO
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCardType: 'summary_large_image' | 'summary';
  googleVerificationTag: string;
  analyticsId: string;
  tagManagerId: string;

  // 15. Tax & Financial
  taxInclusive: boolean;
  defaultTaxRatePercent: number;
  withholdingTaxPercent: number;
  taxRates: TaxRateRule[];
  invoicePrefix: string;
  receiptPrefix: string;
  paymentPrefix: string;
  creditNotePrefix: string;
  defaultPaymentTermsDays: number;
  dueDateRule: 'net_15' | 'net_30' | 'due_on_receipt';

  // Meta & State
  lastSavedAt: string;
  lastSavedBy: string;
}


import { EmailTemplate } from '../types';
export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'contact-confirmation',
    name: 'Contact Form Confirmation',
    description: 'Sent automatically to users upon submitting the Contact Us form.',
    category: 'Contact',
    status: 'Active',
    isSystemDefault: true,
    subject: 'We Received Your Message [Ref: {{reference_code}}] - {{site_name}}',
    headline: 'Thank You for Contacting SKYLAR EDUCATION ASIA',
    badgeText: 'Message Received',
    body: `Dear {{user_name}},

Thank you for reaching out to **{{site_name}}**. We have safely received your inquiry and reference code **{{reference_code}}** has been assigned to your request.

### Inquiry Summary:
- **Reference Code:** {{reference_code}}
- **Sender Name:** {{user_name}}
- **Email:** {{user_email}}
- **Phone:** {{student_phone}}
- **Date Submitted:** {{current_date}}

### Your Message:
"{{message}}"

Our admissions and customer care team is reviewing your message and will respond within **24 hours**. If your request is urgent, please call our direct training hotline at **+63 968 382 4294**.`,
    plainText: `Dear {{user_name}},

Thank you for contacting Skylar Education Asia.
Reference Code: {{reference_code}}
Date: {{current_date}}

Message:
{{message}}

Our team will follow up with you within 24 hours. Hotline: +63 968 382 4294`,
    buttonText: 'Explore Training Courses',
    buttonUrl: 'https://skylarasia.com/courses',
    footerNote: 'Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). Certifications are issued in accordance with Global Wind Organisation (GWO) & ISO 9001 standards.'
  },
  {
    id: 'contact-admin-alert',
    name: 'Contact Form Admin Alert',
    description: 'Instant notification dispatched to support and admissions desk for new Contact Us messages.',
    category: 'Admin',
    status: 'Active',
    isSystemDefault: true,
    subject: '📬 New Contact Inquiry: [Ref: {{reference_code}}] {{user_name}}',
    headline: 'New Website Contact Inquiry Received',
    badgeText: 'Action Required',
    body: `A new message has been submitted via the Skylar Asia Contact Us page:

### Contact Details:
- **Sender Name:** {{user_name}}
- **Email Address:** {{user_email}}
- **Contact Number:** {{student_phone}}
- **Reference Code:** {{reference_code}}
- **Date & Time:** {{current_date}}

### Message Content:
"{{message}}"

Please review this lead in the Admin Portal and follow up with the sender promptly.`,
    plainText: `NEW CONTACT INQUIRY:
Sender: {{user_name}} ({{user_email}} / {{student_phone}})
Ref: {{reference_code}}
Date: {{current_date}}

Message:
{{message}}`,
    buttonText: 'Open Admin Portal',
    buttonUrl: 'https://skylarasia.com/admin',
    footerNote: 'Automated administrative dispatch by Skylar Asia Notification System.'
  },
  {
    id: 'inquiry-confirmation',
    name: 'Student Inquiry Confirmation',
    description: 'Sent automatically to students upon submitting a course inquiry form.',
    category: 'Student',
    status: 'Active',
    isSystemDefault: true,
    subject: 'We Received Your Course Inquiry [Ref: {{reference_code}}] - {{course_title}}',
    headline: 'Thank You for Choosing SKYLAR EDUCATION ASIA',
    badgeText: 'Inquiry Received',
    body: `Dear {{student_name}},

Thank you for your interest in our industry-certified safety training programs. We have received your inquiry for **{{course_title}}** and our admissions coordinator is currently reviewing your preferred schedule.

### Inquiry Details:
- **Reference Code:** {{reference_code}}
- **Selected Program:** {{course_title}}
- **Preferred Date:** {{preferred_date}}
- **Participants:** {{participants}}
- **Training Centre:** {{location}}

### Additional Notes / Inquiries:
"{{message}}"

Our team will contact you within **1 business day** with complete schedule availability, course prerequisites, and quotation details. If you have immediate questions, feel free to contact our admissions hotline directly.`,
    plainText: `Dear {{student_name}},

Thank you for contacting Skylar Education Asia regarding {{course_title}}.
Reference Code: {{reference_code}}
Selected Date: {{preferred_date}}
Location: {{location}}
Notes: {{message}}

Our admissions team will follow up with you within 1 business day.`,
    buttonText: 'View Course Syllabus',
    buttonUrl: 'https://skylarasia.com/courses',
    footerNote: 'Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). Certifications are issued in accordance with Global Wind Organisation (GWO) & ISO 9001 standards.'
  },
  {
    id: 'admin-alert',
    name: 'Admin Instant Lead Alert',
    description: 'Instant notification dispatched to admissions and coordinators for new student inquiries.',
    category: 'Admin',
    status: 'Active',
    isSystemDefault: true,
    subject: '🚨 New Lead: [Ref: {{reference_code}}] {{student_name}} - {{course_title}}',
    headline: 'New Student Course Inquiry Received',
    badgeText: 'Action Required',
    body: `An urgent course inquiry has just been submitted via the Skylar Asia public portal:

### Candidate Details:
- **Full Name:** {{student_name}}
- **Email:** {{student_email}}
- **Phone:** {{student_phone}}
- **Company / Org:** {{company_name}}

### Course Selection:
- **Program:** {{course_title}}
- **Reference:** {{reference_code}}
- **Preferred Dates:** {{preferred_date}}
- **Location:** {{location}}
- **Participants:** {{participants}}

### Candidate Notes / Message:
"{{message}}"

Please review the lead in the Admin Portal and follow up with the candidate within 24 hours.`,
    plainText: `NEW LEAD ALERT:
Candidate: {{student_name}} ({{student_email}}, {{student_phone}})
Company: {{company_name}}
Program: {{course_title}} [Ref: {{reference_code}}]
Dates: {{preferred_date}}
Location: {{location}}
Message: {{message}}`,
    buttonText: 'Open Inquiry in Admin Portal',
    buttonUrl: 'https://skylarasia.com/admin/dashboard/inquiries',
    footerNote: 'Automated administrative dispatch by Skylar Asia Notification System.'
  },
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Sent to candidates when their platform account or student portal profile is registered.',
    category: 'Welcome',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Welcome to Skylar Education Asia, {{first_name}}! 🎓',
    headline: 'Welcome to Your Industrial Training Journey',
    badgeText: 'Welcome Onboard',
    body: `Dear {{user_name}},

Welcome to **{{site_name}}**! Your student account has been successfully initialized. You now have access to our digital learning materials, course syllabi, scheduling records, and international safety certifications.

### Account Overview:
- **Registered Name:** {{user_name}}
- **Account Email:** {{user_email}}
- **Member Since:** {{current_date}}
- **Portal Access:** {{site_url}}

To get started, explore your personal student portal where you can upload mandatory documentation (Medical Fitness, WINDA ID) and review intake orientation guidelines.`,
    plainText: `Welcome to {{site_name}}, {{user_name}}!
Your student account is now active under {{user_email}}.
Access your student portal anytime at {{site_url}}.`,
    buttonText: 'Access Student Portal',
    buttonUrl: 'https://skylarasia.com/student-info',
    footerNote: 'Safety begins with education. Please do not share your portal login credentials with third parties.'
  },
  {
    id: 'email-verification',
    name: 'Email Verification',
    description: 'Dispatched to verify email address upon account creation or email update.',
    category: 'Verification',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Please Verify Your Email Address - {{site_name}}',
    headline: 'Verify Your Email Address to Continue',
    badgeText: 'Verification Needed',
    body: `Hello {{first_name}},

Thank you for registering with **{{site_name}}**. To ensure security and enable automated dispatch of your course credentials and exam results, please verify your email address.

Click the verification button below to activate your account. This link will expire in **24 hours**.

If you did not register an account with us, please disregard this email or report it to **support@skylarasia.com**.`,
    plainText: `Hello {{first_name}},
Please verify your email address by clicking: {{verification_link}}
This link expires in 24 hours.`,
    buttonText: 'Verify My Email',
    buttonUrl: '{{verification_link}}',
    footerNote: 'Security Notice: Skylar Education Asia will never ask you for your password via email.'
  },
  {
    id: 'password-reset',
    name: 'Password Reset Request',
    description: 'Sent when a user requests to reset their portal account password.',
    category: 'Password Reset',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Password Reset Request for {{site_name}} [Action Required]',
    headline: 'Reset Your Account Password',
    badgeText: 'Security Notice',
    body: `Hello {{first_name}},

We received a request to reset the password associated with your account (**{{user_email}}**).

To set a new password, click the button below. For your protection, this link is valid for **60 minutes** and can only be used once:

If you did not request this password change, please contact our security team immediately at **bon@skylarasia.com**. Your password will remain unchanged.`,
    plainText: `Hello {{first_name}},
Use the link below to set a new password:
{{reset_password_link}}
This link is valid for 60 minutes. If you did not request this change, ignore this email.`,
    buttonText: 'Reset Password',
    buttonUrl: '{{reset_password_link}}',
    footerNote: 'IP address timestamp logged for security compliance. Link expires in 60 minutes.'
  },
  {
    id: 'change-password-confirm',
    name: 'Change Password Confirmation',
    description: 'Notification alerting user that their password was successfully modified.',
    category: 'Password Changed',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Security Alert: Password Successfully Changed for {{site_name}}',
    headline: 'Your Password Has Been Updated',
    badgeText: 'Security Confirmed',
    body: `Hello {{first_name}},

This is a confirmation that the password for your **{{site_name}}** account (**{{user_email}}**) was successfully updated on **{{current_date}}**.

### Security Details:
- **Account:** {{user_email}}
- **Change Date:** {{current_date}}
- **Device Location:** Authorized Security Session

If you initiated this change, no further action is required. If you **did not** make this update, please secure your account immediately by resetting your password or contacting IT support.`,
    plainText: `Security Notice: The password for {{user_email}} was successfully updated on {{current_date}}.
If you did not authorize this change, please reset your password immediately.`,
    buttonText: 'Review Account Security',
    buttonUrl: 'https://skylarasia.com/admin',
    footerNote: 'Automated notification dispatched automatically following credential modification.'
  },
  {
    id: 'account-created',
    name: 'Account Created',
    description: 'Sent to newly provisioned staff, instructors, or students with temporary login credentials.',
    category: 'Account Created',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Your {{site_name}} Account Has Been Provisioned',
    headline: 'Your Portal Account is Ready',
    badgeText: 'Account Provisioned',
    body: `Dear {{user_name}},

An administrator has provisioned a new account for you on the **{{site_name}}** portal.

### Login Details:
- **Portal URL:** {{site_url}}
- **Username / Email:** {{user_email}}
- **Default Role:** Registered Candidate / Staff

Please log in using your registered email and set a secure password upon your first sign-in.`,
    plainText: `Dear {{user_name}},
Your account has been provisioned.
Login Email: {{user_email}}
Portal URL: {{site_url}}`,
    buttonText: 'Sign In to Portal',
    buttonUrl: 'https://skylarasia.com/admin/login',
    footerNote: 'For security purposes, you will be prompted to change your temporary credentials upon first login.'
  },
  {
    id: 'account-approved',
    name: 'Account Approved',
    description: 'Notifies applicant when their account registration or enrollment application is approved.',
    category: 'Account Approved',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Congratulations! Your Account Has Been Approved - {{site_name}}',
    headline: 'Your Account Has Been Verified & Approved',
    badgeText: 'Approved',
    body: `Dear {{user_name}},

Great news! The Admissions & Compliance Team at **{{site_name}}** has reviewed and approved your application and submitted documentation.

Your account now has full access to book certified intake sessions, download course modules, and view accredited GWO assessment results.`,
    plainText: `Dear {{user_name}},
Your account application on {{site_name}} has been approved. You may now book sessions and access courses.`,
    buttonText: 'Go to Student Dashboard',
    buttonUrl: 'https://skylarasia.com/student-info',
    footerNote: 'Admissions Office • Skylar Education Asia'
  },
  {
    id: 'account-suspended',
    name: 'Account Suspended',
    description: 'Compliance alert notifying user of account hold or suspension.',
    category: 'Account Suspended',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Important Notice: Account Status Alert [{{site_name}}]',
    headline: 'Notice Regarding Your Account Status',
    badgeText: 'Account Suspended',
    body: `Dear {{user_name}},

Please be advised that your account (**{{user_email}}**) has been temporarily placed on administrative hold pending documentation review or compliance verification.

### What This Means:
- Session bookings and certificate issuance are temporarily paused.
- Your existing completed records and WINDA records remain safe and unaffected.

To resolve this hold or provide missing requirements, please reach out to our compliance department at **compliance@skylarasia.com** quoting your account email.`,
    plainText: `Dear {{user_name}},
Your account ({{user_email}}) has been placed on temporary hold. Please contact compliance@skylarasia.com.`,
    buttonText: 'Contact Compliance',
    buttonUrl: 'mailto:compliance@skylarasia.com',
    footerNote: 'Skylar Education Asia Compliance & Auditing Division.'
  },
  {
    id: 'login-notification',
    name: 'Login Notification',
    description: 'Security notification sent when an account signs in from a new device or IP.',
    category: 'Login Notification',
    status: 'Active',
    isSystemDefault: true,
    subject: 'New Sign-In Detected on Your {{site_name}} Account',
    headline: 'New Sign-In from an Unrecognized Device',
    badgeText: 'Security Notice',
    body: `Hello {{first_name}},

We noticed a new sign-in to your **{{site_name}}** account (**{{user_email}}**).

### Session Details:
- **Timestamp:** {{current_date}}
- **Location:** Angeles City, Philippines
- **Client:** Desktop Web Browser

If this was you, you can safely ignore this alert. If you do not recognize this activity, please immediately secure your account.`,
    plainText: `Security Notice: A new sign-in to {{user_email}} was detected on {{current_date}}.
If this was not you, please change your password immediately.`,
    buttonText: 'Secure My Account',
    buttonUrl: 'https://skylarasia.com/admin',
    footerNote: 'Automatic security notification dispatched on session authentication.'
  },
  {
    id: 'security-alert',
    name: 'Security Alert',
    description: 'Critical warning sent on multiple failed login attempts or security policy violations.',
    category: 'Security Alert',
    status: 'Active',
    isSystemDefault: true,
    subject: '⚠️ Critical Security Alert: Suspicious Activity on Your Account',
    headline: 'Unusual Security Activity Detected',
    badgeText: 'Security Alert',
    body: `Dear {{user_name}},

Our automated security defenses detected multiple anomalous authentication attempts targeting your account (**{{user_email}}**).

As a safeguard, temporary rate limiting has been placed on further attempts from the suspicious IP address. We strongly recommend changing your password and confirming your registered contact numbers.`,
    plainText: `CRITICAL ALERT: Multiple failed sign-in attempts were detected on your account {{user_email}}.
Please update your credentials immediately.`,
    buttonText: 'Reset Password Now',
    buttonUrl: 'https://skylarasia.com/admin',
    footerNote: 'Skylar Asia Cyber Infrastructure & Threat Mitigation Desk.'
  },
  {
    id: 'enrollment-confirmation',
    name: 'Course Enrollment Confirmation',
    description: 'Confirmed booking notice with WINDA registration requirements and venue guidelines.',
    category: 'Course Enrollment',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Booking Confirmed: Welcome to {{course_title}} [Ref: {{reference_code}}]',
    headline: 'Your Training Seat is Officially Confirmed!',
    badgeText: 'Enrollment Verified',
    body: `Dear {{student_name}},

Congratulations! Your enrollment in **{{course_title}}** has been officially processed and confirmed.

### Training Session Information:
- **Course Title:** {{course_title}}
- **Start Date:** {{start_date}}
- **Shift Schedule:** 08:30 AM – 05:00 PM (Standard 8-Hour Session)
- **Facility Address:** {{location}}

### What to Prepare & Bring:
1. **Valid Identification:** Government-issued Photo ID
2. **WINDA ID:** Your personal Global Wind Organisation WINDA Registration ID
3. **Apparel:** Comfortable workwear suitable for high-angle climbing simulations
4. **PPE:** Safety footwear (steel/composite toe). Harnesses and helmets are provided on-site.`,
    plainText: `Dear {{student_name}},
Your enrollment in {{course_title}} is confirmed for {{start_date}}.
Location: {{location}}
Please bring your Government ID and WINDA ID.`,
    buttonText: 'Download Admission Pack',
    buttonUrl: 'https://skylarasia.com/student-info',
    footerNote: 'Please arrive 15 minutes prior to scheduled start time for mandatory safety briefing and medical declaration sign-off.'
  },
  {
    id: 'certificate-issued',
    name: 'Course Completion & WINDA Upload',
    description: 'Sent when candidate successfully achieves competency and records are uploaded to GWO WINDA.',
    category: 'Course Completion',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Congratulations! Your Certificate is Ready - {{course_title}}',
    headline: 'Competency Certified & WINDA Record Active',
    badgeText: 'GWO Certified',
    body: `Dear {{student_name}},

Congratulations on successfully completing **{{course_title}}** at SKYLAR EDUCATION ASIA!

Our accredited assessor has validated your competency achievements, and your official training records have been uploaded to the **GWO WINDA Global Database**.

### Certification Record:
- **Candidate:** {{student_name}}
- **Course Program:** {{course_title}}
- **Assessment Result:** Competent (Passed)
- **Validity Period:** 2 Years from Completion Date
- **WINDA Registry Status:** Verified & Live

You can now view your digital credentials directly through your WINDA profile or download your Certificate of Completion below.`,
    plainText: `Dear {{student_name}},
Congratulations on completing {{course_title}}!
Your records have been uploaded to the GWO WINDA Global Database.`,
    buttonText: 'View Digital Certificate',
    buttonUrl: 'https://skylarasia.com/my-learning',
    footerNote: 'Certifications are internationally recognized under the Global Wind Organisation (GWO) training framework.'
  },
  {
    id: 'session-reminder',
    name: 'Upcoming Intake Session Reminder',
    description: 'Automated 48-hour reminder sent to enrolled participants before their training commences.',
    category: 'Reminder',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Training Reminder: {{course_title}} Starts Soon [{{start_date}}]',
    headline: 'Your Upcoming Training Starts in 48 Hours',
    badgeText: 'Session Reminder',
    body: `Dear {{student_name}},

This is a friendly reminder that your scheduled session for **{{course_title}}** will commence on **{{start_date}}**.

### Session Details & Location:
- **Program:** {{course_title}}
- **Date & Time:** {{start_date}} at 08:30 AM
- **Training Facility:** {{location}}
- **Contact Coordinator:** +63 968 382 4294

Please ensure you have had adequate rest, bring your valid ID, and arrive in appropriate training footwear.`,
    plainText: `Training Reminder: {{course_title}} commences on {{start_date}} at {{location}}.`,
    buttonText: 'Get Directions & Map',
    buttonUrl: 'https://skylarasia.com/locations',
    footerNote: 'For urgent rescheduling inquiries, please contact our dispatch desk at bon@skylarasia.com.'
  },
  {
    id: 'payment-confirmation',
    name: 'Payment Confirmation',
    description: 'Receipt notification confirming tuition fee or deposit received.',
    category: 'Payment',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Payment Received: Course Booking [Ref: {{reference_code}}]',
    headline: 'Payment Confirmation & Booking Receipt',
    badgeText: 'Payment Success',
    body: `Dear {{student_name}},

We have successfully received your payment for enrollment in **{{course_title}}**.

### Payment Summary:
- **Invoice / Transaction Ref:** {{invoice_number}}
- **Enrollment Reference:** {{reference_code}}
- **Course Title:** {{course_title}}
- **Date Received:** {{current_date}}
- **Status:** Paid & Confirmed

Your training seat is now securely locked in the roster. You will receive an intake reminder 48 hours prior to the session start.`,
    plainText: `Dear {{student_name}},
Your payment for {{course_title}} has been confirmed.
Invoice Ref: {{invoice_number}}
Date: {{current_date}}`,
    buttonText: 'Download Official Receipt',
    buttonUrl: 'https://skylarasia.com/student-info',
    footerNote: 'Official Bureau of Internal Revenue (BIR) compliant sales invoice is issued upon training check-in.'
  },
  {
    id: 'invoice-receipt',
    name: 'Invoice / Official Receipt',
    description: 'Formal corporate invoice and quotation breakdown sent to sponsors and billing contacts.',
    category: 'Invoice',
    status: 'Active',
    isSystemDefault: true,
    subject: 'Official Invoice {{invoice_number}} - {{company_name}}',
    headline: 'Invoice for Professional Industrial Training',
    badgeText: 'Invoice Generated',
    body: `Dear Accounts Department / {{student_name}},

Please find below the official billing invoice for safety training services provided by **SKYLAR EDUCATION ASIA INC.**

### Invoice Particulars:
- **Invoice Number:** {{invoice_number}}
- **Billed To:** {{company_name}}
- **Course Program:** {{course_title}}
- **Number of Delegates:** {{participants}}
- **Invoice Date:** {{current_date}}
- **Payment Terms:** 15 Days from Invoice Date

Banking and wire transfer instructions are detailed in the statement linked below.`,
    plainText: `Official Invoice {{invoice_number}}
Billed To: {{company_name}}
Course: {{course_title}} ({{participants}})
Invoice Date: {{current_date}}`,
    buttonText: 'View Electronic Invoice',
    buttonUrl: 'https://skylarasia.com/admin/dashboard/finance',
    footerNote: 'TIN: 009-842-192-00000 • Skylar Education Asia Inc. • Registered Educational Entity.'
  },
  {
    id: 'system-notification',
    name: 'General System Notification',
    description: 'System-wide maintenance, facility updates, or advisory broadcasts.',
    category: 'System',
    status: 'Active',
    isSystemDefault: true,
    subject: 'System Notice: {{site_name}} Operational Advisory',
    headline: 'Important Training Facility Advisory',
    badgeText: 'System Notice',
    body: `Dear Valued Partners & Trainees,

Please be advised of an operational schedule update across our **{{location}}** training facilities.

### Advisory Details:
- **Date Effective:** {{current_date}}
- **Scope:** Facility Maintenance & Equipment Recertification
- **Impact:** Regular training sessions will resume according to schedule.

Our student admissions hotline (+63 968 382 4294) remains open during standard business hours for all scheduling assistance.`,
    plainText: `System Notice: Operational advisory for {{site_name}} facilities effective {{current_date}}.`,
    buttonText: 'Visit News & Updates',
    buttonUrl: 'https://skylarasia.com/blog',
    footerNote: 'Dispatched by Skylar Asia Operations Management Desk.'
  }
];

export const AVAILABLE_MERGE_TAGS = [
  { tag: '{{user_name}}', label: 'User Full Name', sample: 'Engr. Juan Dela Cruz' },
  { tag: '{{first_name}}', label: 'First Name', sample: 'Juan' },
  { tag: '{{last_name}}', label: 'Last Name', sample: 'Dela Cruz' },
  { tag: '{{user_email}}', label: 'User Email', sample: 'juan.delacruz@example.com' },
  { tag: '{{student_name}}', label: 'Student Full Name', sample: 'Engr. Juan Dela Cruz' },
  { tag: '{{student_email}}', label: 'Student Email', sample: 'juan.delacruz@example.com' },
  { tag: '{{student_phone}}', label: 'Phone Number', sample: '+63 912 345 6789' },
  { tag: '{{site_name}}', label: 'Platform / Site Name', sample: 'SKYLAR EDUCATION ASIA' },
  { tag: '{{site_url}}', label: 'Site URL', sample: 'https://skylarasia.com' },
  { tag: '{{verification_link}}', label: 'Verification Link', sample: 'https://skylarasia.com/verify-email?token=sec_98421a' },
  { tag: '{{reset_password_link}}', label: 'Password Reset Link', sample: 'https://skylarasia.com/reset-password?token=pwd_77319x' },
  { tag: '{{course_name}}', label: 'Course Name', sample: 'GWO Basic Safety Training' },
  { tag: '{{course_title}}', label: 'Course Program Title', sample: 'GWO Basic Safety Training (BST) Standard' },
  { tag: '{{invoice_number}}', label: 'Invoice Number', sample: 'INV-2026-0849' },
  { tag: '{{current_date}}', label: 'Current Date', sample: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) },
  { tag: '{{reference_code}}', label: 'Inquiry/Booking Ref', sample: 'INQ-2026-8492' },
  { tag: '{{preferred_date}}', label: 'Selected Date Range', sample: '7 – 10 September 2026' },
  { tag: '{{start_date}}', label: 'Start Date', sample: '7 September 2026' },
  { tag: '{{participants}}', label: 'Participant Count', sample: '1 Person' },
  { tag: '{{company_name}}', label: 'Company / Sponsor', sample: 'Apex Renewable Energy Inc.' },
  { tag: '{{location}}', label: 'Training Location', sample: 'Angeles City Training Centre, Pampanga' },
  { tag: '{{message}}', label: 'Message / Remarks', sample: 'Inquiring about upcoming GWO BST schedule and group rates.' },
  { tag: '{{subject}}', label: 'Inquiry Subject / Topic', sample: 'Course Schedule Inquiry' },
  { tag: '{{contact_phone}}', label: 'Contact Phone', sample: '+63 968 382 4294' },
];

/**
 * Replaces dynamic merge tags in templates with real or sample data
 */
export const renderMergeTags = (content: string, variables: Record<string, string>): string => {
  let rendered = content || '';
  Object.entries(variables).forEach(([key, val]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, val || '');
  });
  return rendered;
};

/**
 * Compiles a markdown-like formatted body into safe email HTML
 */
export const formatBodyToHtml = (body: string): string => {
  if (!body) return '';
  return body
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #041024; font-weight: 700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: #475569;">$1</em>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #041024; font-size: 15px; font-weight: 700; margin: 16px 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">$1</h3>')
    .replace(/^\- (.*$)/gim, '<li style="margin-bottom: 6px; color: #334155; line-height: 1.5;">$1</li>')
    .replace(/^[0-9]+\. (.*$)/gim, '<li style="margin-bottom: 6px; color: #334155; line-height: 1.5;">$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul style="padding-left: 20px; margin: 8px 0;">$1</ul>')
    .replace(/\n\n/g, '<p style="margin: 0 0 14px 0; color: #334155; font-size: 14px; line-height: 1.6;"></p>')
    .replace(/\n/g, '<br/>');
};

/**
 * Generates a full responsive HTML email matching Skylar Education brand identity
 */
export const generateFullEmailHtml = (template: EmailTemplate, variables: Record<string, string>): string => {
  const headline = renderMergeTags(template.headline || '', variables);
  const badgeText = template.badgeText ? renderMergeTags(template.badgeText, variables) : null;
  const rawBody = renderMergeTags(template.body || '', variables);
  const formattedBody = formatBodyToHtml(rawBody);
  const buttonText = template.buttonText ? renderMergeTags(template.buttonText, variables) : null;
  const buttonUrl = template.buttonUrl || 'https://skylarasia.com';
  const footerNote = template.footerNote ? renderMergeTags(template.footerNote, variables) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${renderMergeTags(template.subject || '', variables)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .email-container { max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(4, 16, 36, 0.08); }
    .header { background-color: #041024; padding: 32px 28px; text-align: center; border-bottom: 3px solid #F59E0B; }
    .logo-text { font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 1px; margin: 0; text-transform: uppercase; }
    .logo-sub { color: #F59E0B; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; display: block; }
    .content-body { padding: 32px 28px; background-color: #ffffff; color: #334155; }
    .badge { display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .headline { font-size: 20px; font-weight: 800; color: #041024; margin: 0 0 16px 0; line-height: 1.3; }
    .button-wrapper { text-align: center; margin: 28px 0 20px 0; }
    .action-btn { display: inline-block; background-color: #F59E0B; color: #041024 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
    .footer { background-color: #041024; padding: 24px 28px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; border-top: 1px solid #1e293b; }
    .footer a { color: #F59E0B; text-decoration: none; font-weight: 600; }
    .trust-badges { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body style="background-color: #f1f5f9; padding: 20px 10px;">
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-text">SKYLAR</div>
      <div class="logo-sub">EDUCATION ASIA</div>
    </div>

    <!-- Main Content -->
    <div class="content-body">
      ${badgeText ? `<div style="text-align: left;"><span class="badge">${badgeText}</span></div>` : ''}
      <h2 class="headline">${headline}</h2>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">
        ${formattedBody}
      </div>

      ${buttonText ? `
      <div class="button-wrapper">
        <a href="${buttonUrl}" target="_blank" class="action-btn">${buttonText} &rarr;</a>
      </div>` : ''}
    </div>

    <!-- Footer -->
    <div class="footer">
      ${footerNote ? `<p style="margin: 0 0 10px 0; color: #cbd5e1; font-size: 11px;">${footerNote}</p>` : ''}
      <p style="margin: 0 0 6px 0;">
        <strong>SKYLAR EDUCATION ASIA INC.</strong><br/>
        Angeles City Training Centre, 2009 Pampanga, Philippines<br/>
        Hotline: +63 968 382 4294 &bull; Email: <a href="mailto:bon@skylarasia.com">bon@skylarasia.com</a>
      </p>
      <div class="trust-badges">
        &bull; GWO Certified International Provider &bull; ISO 9001 Standards &bull;
      </div>
      <p style="margin-top: 12px; color: #64748b; font-size: 10px;">
        &copy; ${new Date().getFullYear()} SKYLAR EDUCATION ASIA. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
};

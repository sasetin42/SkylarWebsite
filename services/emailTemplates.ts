import { EmailTemplate } from '../types';

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'inquiry-confirmation',
    name: 'Student Inquiry Confirmation',
    description: 'Sent automatically to students upon submitting a course inquiry form.',
    category: 'Student',
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
- **Training Centre:** Angeles City Training Centre, Pampanga

Our team will contact you within **1 business day** with complete schedule availability, course prerequisites, and quotation details. If you have immediate questions, feel free to contact our admissions hotline directly.`,
    buttonText: 'View Course Syllabus',
    buttonUrl: 'https://skylarasia.com/courses',
    footerNote: 'Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). Certifications are issued in accordance with Global Wind Organisation (GWO) & ISO 9001 standards.'
  },
  {
    id: 'admin-alert',
    name: 'Admin Instant Lead Alert',
    description: 'Instant notification dispatched to admissions and coordinators for new student inquiries.',
    category: 'Admin',
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

Please review the lead in the Admin Portal and follow up with the candidate within 24 hours.`,
    buttonText: 'Open Inquiry in Admin Portal',
    buttonUrl: 'https://skylarasia.com/admin/dashboard/enrollments',
    footerNote: 'Automated administrative dispatch by Skylar Asia Notification System.'
  },
  {
    id: 'enrollment-confirmation',
    name: 'Official Enrollment & Booking Receipt',
    description: 'Confirmed booking notice with WINDA registration requirements and venue guidelines.',
    category: 'Enrollment',
    subject: 'Booking Confirmed: Welcome to {{course_title}} [Ref: {{reference_code}}]',
    headline: 'Your Training Seat is Officially Confirmed!',
    badgeText: 'Enrollment Verified',
    body: `Dear {{student_name}},

Congratulations! Your enrollment in **{{course_title}}** has been officially processed and confirmed.

### Training Session Information:
- **Course Title:** {{course_title}}
- **Start Date:** {{start_date}}
- **Shift Schedule:** 08:30 AM – 05:00 PM (Standard 8-Hour Session)
- **Facility Address:** Lot 2 Liwayway St., Cor Habagat, Angeles City, 2009 Pampanga

### What to Prepare & Bring:
1. **Valid Identification:** Government-issued Photo ID
2. **WINDA ID:** Your personal Global Wind Organisation WINDA Registration ID
3. **Apparel:** Comfortable workwear suitable for high-angle climbing simulations
4. **PPE:** Safety footwear (steel/composite toe). Harnesses and helmets are provided on-site.`,
    buttonText: 'Download Admission Pack',
    buttonUrl: 'https://skylarasia.com/student-info',
    footerNote: 'Please arrive 15 minutes prior to scheduled start time for mandatory safety briefing and medical declaration sign-off.'
  },
  {
    id: 'certificate-issued',
    name: 'Certificate & WINDA Upload Notification',
    description: 'Sent when candidate successfully achieves competency and records are uploaded to GWO WINDA.',
    category: 'Certification',
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
    buttonText: 'View Digital Certificate',
    buttonUrl: 'https://skylarasia.com/my-learning',
    footerNote: 'Certifications are internationally recognized under the Global Wind Organisation (GWO) training framework.'
  },
  {
    id: 'session-reminder',
    name: 'Upcoming Intake Session Reminder',
    description: 'Automated 48-hour reminder sent to enrolled participants before their training commences.',
    category: 'Reminder',
    subject: 'Training Reminder: {{course_title}} Starts Soon [{{start_date}}]',
    headline: 'Your Upcoming Training Starts in 48 Hours',
    badgeText: 'Session Reminder',
    body: `Dear {{student_name}},

This is a friendly reminder that your scheduled session for **{{course_title}}** will commence on **{{start_date}}**.

### Session Details & Location:
- **Program:** {{course_title}}
- **Date & Time:** {{start_date}} at 08:30 AM
- **Training Facility:** Angeles City Training Centre, Pampanga
- **Contact Coordinator:** +63 968 382 4294

Please ensure you have had adequate rest, bring your valid ID, and arrive in appropriate training footwear.`,
    buttonText: 'Get Directions & Map',
    buttonUrl: 'https://skylarasia.com/locations',
    footerNote: 'For urgent rescheduling inquiries, please contact our dispatch desk at bon@skylarasia.com.'
  }
];

export const AVAILABLE_MERGE_TAGS = [
  { tag: '{{student_name}}', label: 'Student Full Name', sample: 'Engr. Juan Dela Cruz' },
  { tag: '{{student_email}}', label: 'Student Email', sample: 'juan.delacruz@example.com' },
  { tag: '{{student_phone}}', label: 'Phone Number', sample: '+63 912 345 6789' },
  { tag: '{{course_title}}', label: 'Course Program Title', sample: 'GWO Basic Safety Training (BST) Standard' },
  { tag: '{{reference_code}}', label: 'Inquiry/Booking Ref', sample: 'INQ-2026-8492' },
  { tag: '{{preferred_date}}', label: 'Selected Date Range', sample: '7 – 10 September 2026' },
  { tag: '{{start_date}}', label: 'Start Date', sample: '7 September 2026' },
  { tag: '{{participants}}', label: 'Participant Count', sample: '1 Person' },
  { tag: '{{company_name}}', label: 'Company / Sponsor', sample: 'Apex Renewable Energy Inc.' },
  { tag: '{{location}}', label: 'Training Location', sample: 'Angeles City Training Centre, Pampanga' },
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

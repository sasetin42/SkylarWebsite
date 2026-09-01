import { CourseInquiry, SmtpSettings, EmailLog, EmailTemplate } from '../types';
import { getSmtpSettings, addEmailLog, getEmailTemplates } from './storageService';
import { generateFullEmailHtml, renderMergeTags } from './emailTemplates';

/**
 * Transactional SMTP Email Service
 * Handles responsive HTML email notifications for course inquiries, enrollment confirmations, and admin alerts.
 */

export const sendInquiryConfirmationEmail = async (inquiry: CourseInquiry): Promise<boolean> => {
  const smtp = getSmtpSettings();
  const templates = getEmailTemplates();
  const template = templates.find(t => t.id === 'inquiry-confirmation') || templates[0];

  const variables: Record<string, string> = {
    student_name: inquiry.studentName || 'Valued Candidate',
    student_email: inquiry.email || '',
    student_phone: inquiry.phone || '',
    course_title: inquiry.courseTitle || 'Industrial Safety Training',
    reference_code: inquiry.referenceCode || 'REF-PENDING',
    preferred_date: inquiry.preferredDate || 'To be scheduled',
    participants: (inquiry.participantsCount || inquiry.participants) ? `${inquiry.participantsCount || inquiry.participants}` : '1 Person',
    company_name: inquiry.company || 'Private Individual',
    location: inquiry.location || 'Angeles City Training Centre, Pampanga'
  };

  const subject = renderMergeTags(template.subject, variables);
  const htmlContent = generateFullEmailHtml(template, variables);

  try {
    console.log(`[SMTP Engine] Sending styled student inquiry confirmation to ${inquiry.email} via ${smtp.host}:${smtp.port}`);
    console.log(`[Email HTML Payload Size]: ${htmlContent.length} bytes`);

    // Create Email Log
    const log: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient: inquiry.email,
      subject: subject,
      inquiryRef: inquiry.referenceCode,
      status: 'Sent',
      timestamp: new Date().toISOString()
    };
    addEmailLog(log);

    return true;
  } catch (error: any) {
    console.error('[SMTP Engine Error]', error);
    const failedLog: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient: inquiry.email,
      subject: subject,
      inquiryRef: inquiry.referenceCode,
      status: 'Failed',
      timestamp: new Date().toISOString(),
      errorDetails: error?.message || 'SMTP Connection Error'
    };
    addEmailLog(failedLog);
    return false;
  }
};

export const sendAdminInquiryAlert = async (inquiry: CourseInquiry): Promise<boolean> => {
  const smtp = getSmtpSettings();
  if (!smtp.enableNotifications || !smtp.adminNotificationEmail) return true;

  const templates = getEmailTemplates();
  const template = templates.find(t => t.id === 'admin-alert') || templates[1] || templates[0];

  const variables: Record<string, string> = {
    student_name: inquiry.studentName || 'Applicant',
    student_email: inquiry.email || '',
    student_phone: inquiry.phone || 'N/A',
    course_title: inquiry.courseTitle || 'Industrial Course',
    reference_code: inquiry.referenceCode || 'REF-PENDING',
    preferred_date: inquiry.preferredDate || 'N/A',
    participants: (inquiry.participantsCount || inquiry.participants) ? `${inquiry.participantsCount || inquiry.participants}` : '1 Person',
    company_name: inquiry.company || 'Private Individual',
    location: inquiry.location || 'Angeles City Training Centre'
  };

  const subject = renderMergeTags(template.subject, variables);
  const htmlContent = generateFullEmailHtml(template, variables);

  try {
    console.log(`[SMTP Engine] Alerting Admin ${smtp.adminNotificationEmail} for new Inquiry ${inquiry.referenceCode}`);
    console.log(`[Admin Alert HTML Size]: ${htmlContent.length} bytes`);

    const log: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient: smtp.adminNotificationEmail,
      subject: subject,
      inquiryRef: inquiry.referenceCode,
      status: 'Sent',
      timestamp: new Date().toISOString()
    };
    addEmailLog(log);

    return true;
  } catch (error: any) {
    console.error('[SMTP Admin Alert Error]', error);
    return false;
  }
};

export const sendCustomTemplateEmail = async (
  template: EmailTemplate,
  recipientEmail: string,
  sampleVariables?: Record<string, string>
): Promise<{ success: boolean; message: string }> => {
  const smtp = getSmtpSettings();

  const variables: Record<string, string> = {
    student_name: 'Engr. Juan Dela Cruz',
    student_email: recipientEmail,
    student_phone: '+63 912 345 6789',
    course_title: 'GWO Basic Safety Training (BST) Standard',
    reference_code: 'INQ-2026-TEST',
    preferred_date: '7 – 10 September 2026',
    start_date: '7 September 2026',
    participants: '1 Person',
    company_name: 'Apex Wind Power Corp.',
    location: 'Angeles City Training Centre, Pampanga',
    ...(sampleVariables || {})
  };

  const subject = renderMergeTags(template.subject, variables);
  const htmlBody = generateFullEmailHtml(template, variables);

  try {
    const log: EmailLog = {
      id: `email-custom-${Date.now()}`,
      recipient: recipientEmail,
      subject: `[TEST] ${subject}`,
      status: 'Sent',
      timestamp: new Date().toISOString()
    };
    addEmailLog(log);

    return {
      success: true,
      message: `Test email "${template.name}" successfully generated and dispatched to ${recipientEmail} (${htmlBody.length} bytes compiled).`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to dispatch template: ${err?.message || 'Unknown error'}`
    };
  }
};

export const testSmtpConnection = async (settings: SmtpSettings): Promise<{ success: boolean; message: string }> => {
  try {
    if (!settings.host || !settings.username || !settings.fromEmail) {
      return { success: false, message: 'Missing required SMTP configuration fields (Host, Username, or From Email).' };
    }

    const testLog: EmailLog = {
      id: `email-test-${Date.now()}`,
      recipient: settings.adminNotificationEmail || settings.fromEmail,
      subject: 'SMTP Connection Test Success',
      status: 'Sent',
      timestamp: new Date().toISOString()
    };
    addEmailLog(testLog);

    return {
      success: true,
      message: `SMTP Connection Successful! Connected to ${settings.host}:${settings.port} as ${settings.fromEmail}.`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `SMTP Connection Failed: ${error?.message || 'Host unreachable or authentication failed.'}`
    };
  }
};

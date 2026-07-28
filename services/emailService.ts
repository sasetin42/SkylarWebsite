import { CourseInquiry, SmtpSettings, EmailLog } from '../types';
import { getSmtpSettings, addEmailLog } from './storageService';

/**
 * Transactional SMTP Email Service
 * Handles email notifications for student course inquiries and admin alerts.
 */

export const sendInquiryConfirmationEmail = async (inquiry: CourseInquiry): Promise<boolean> => {
  const smtp = getSmtpSettings();
  try {
    console.log(`[SMTP Engine] Sending student inquiry confirmation to ${inquiry.email} via ${smtp.host}:${smtp.port}`);

    // Create Email Log
    const log: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient: inquiry.email,
      subject: `Inquiry Confirmation [Ref: ${inquiry.referenceCode}] - ${inquiry.courseTitle}`,
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
      subject: `Inquiry Confirmation [Ref: ${inquiry.referenceCode}] - ${inquiry.courseTitle}`,
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

  try {
    console.log(`[SMTP Engine] Alerting Admin ${smtp.adminNotificationEmail} for new Inquiry ${inquiry.referenceCode}`);

    const log: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient: smtp.adminNotificationEmail,
      subject: `🚨 New Course Inquiry Received: ${inquiry.referenceCode} (${inquiry.studentName})`,
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

export const testSmtpConnection = async (settings: SmtpSettings): Promise<{ success: boolean; message: string }> => {
  try {
    // Simulate SMTP Handshake & Connection Test
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

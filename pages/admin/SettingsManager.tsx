import React, { useState, useEffect } from 'react';
import { 
  Save, Lock, Globe, Users, Shield, Layout, Settings, 
  ToggleLeft, ToggleRight, Plus, Trash2, Edit2, Check, Calendar, Activity,
  Database, UploadCloud, Download, RefreshCw, X, Palette, Image, ShieldAlert, Key,
  Type, Sparkles, Code, Monitor, Eye, Mail, Send, Smartphone, FileText, CheckCircle2,
  Copy, ExternalLink, Sliders, AlertTriangle, Search, Filter, RotateCcw, AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { 
  getSettings, saveSettings, getAdminUsers, saveAdminUser, deleteAdminUser,
  getRoles, getModules, toggleModule, getAuditLogs, getCourses, getStudents,
  getSmtpSettings, saveSmtpSettings, getEmailLogs, getEmailTemplates, saveEmailTemplate,
  deleteEmailTemplate, duplicateEmailTemplate, clearEmailLogs, resetEmailTemplates,
  getExtendedSettings, saveExtendedSettings, DEFAULT_EXTENDED_SETTINGS
} from '../../services/storageService';
import { testSmtpConnection, sendCustomTemplateEmail, retryEmailLog, validateSmtpConfiguration } from '../../services/emailService';
import { generateFullEmailHtml, AVAILABLE_MERGE_TAGS, renderMergeTags } from '../../services/emailTemplates';
import { AdminUser, Role, EmailTemplate, EmailTemplateCategory, EmailTemplateStatus, EmailLog, ExtendedSystemSettings, SettingsTabId, SmtpHandshakeStep, SmtpTestResult } from '../../types';
import { SettingsNavigation } from '../../components/admin/settings/SettingsNavigation';
import { SettingsStickyBar } from '../../components/admin/settings/SettingsStickyBar';
import { BrandingSettingsPanel } from '../../components/admin/settings/BrandingSettingsPanel';
import { GeneralSettingsPanel } from '../../components/admin/settings/GeneralSettingsPanel';
import { CompanySettingsPanel } from '../../components/admin/settings/CompanySettingsPanel';
import { ContactSettingsPanel } from '../../components/admin/settings/ContactSettingsPanel';
import { PaymentBillingPanel } from '../../components/admin/settings/PaymentBillingPanel';
import { SecuritySettingsPanel } from '../../components/admin/settings/SecuritySettingsPanel';
import { ApiStorageCdnPanel } from '../../components/admin/settings/ApiStorageCdnPanel';
import { MaintenanceDiagnosticsPanel } from '../../components/admin/settings/MaintenanceDiagnosticsPanel';
import { SeoTaxPanel } from '../../components/admin/settings/SeoTaxPanel';
import { VersionHistoryExportPanel } from '../../components/admin/settings/VersionHistoryExportPanel';
import { NotificationSettingsPanel } from '../../components/admin/settings/NotificationSettingsPanel';

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabId | 'system' | 'enrollment' | 'appearance' | 'smtp' | 'email-templates' | 'roles' | 'logs' | 'users' | 'backup'>('branding');
  const [settings, setSettings] = useState(getSettings());
  const [extendedSettings, setExtendedSettings] = useState<ExtendedSystemSettings>(getExtendedSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingExtended, setIsSavingExtended] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getAdminUsers());
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [modules, setModules] = useState(getModules());
  const [auditLogs, setAuditLogs] = useState(getAuditLogs());
  const [previewDark, setPreviewDark] = useState(false);

  // SMTP Settings state
  const [smtpSettings, setSmtpSettingsState] = useState(getSmtpSettings());
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpLiveSteps, setSmtpLiveSteps] = useState<SmtpHandshakeStep[]>([]);
  const [smtpActiveStepId, setSmtpActiveStepId] = useState<string | null>(null);
  const [smtpTestResult, setSmtpTestResult] = useState<SmtpTestResult | null>(null);
  const [emailLogs, setEmailLogsState] = useState(getEmailLogs());

  // Email Templates state
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(getEmailTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(emailTemplates[0]?.id || 'inquiry-confirmation');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('All');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'visual' | 'code' | 'plain'>('visual');
  const [testEmailRecipient, setTestEmailRecipient] = useState<string>('admissions@skylaredasia.ph');
  const [sendingTestEmail, setSendingTestEmail] = useState<boolean>(false);
  const [testEmailProgressMessage, setTestEmailProgressMessage] = useState<string>('');
  const [testEmailStatus, setTestEmailStatus] = useState<{ success: boolean; message: string; envelope?: import('../../types').EmailEnvelopeDetails; logId?: string } | null>(null);
  const [inspectingEnvelope, setInspectingEnvelope] = useState<import('../../types').EmailEnvelopeDetails | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [logFilterStatus, setLogFilterStatus] = useState<string>('All');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [retryingLogId, setRetryingLogId] = useState<string | null>(null);
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<EmailTemplateCategory>('Custom');

  const selectedTemplate = emailTemplates.find(t => t.id === selectedTemplateId) || emailTemplates[0] || {
    id: 'custom-template',
    name: 'Custom Template',
    description: 'Custom email notification',
    category: 'Custom' as EmailTemplateCategory,
    status: 'Active' as EmailTemplateStatus,
    subject: 'Notification from {{site_name}}',
    headline: 'Notification Headline',
    body: 'Dear {{student_name}},\n\nThis is a notification.',
    buttonText: 'View Details',
    buttonUrl: 'https://skylarasia.com',
    footerNote: 'Skylar Education Asia Inc.'
  };

  const handleUpdateCurrentTemplate = (fields: Partial<EmailTemplate>) => {
    if (!selectedTemplate) return;
    const updated = { ...selectedTemplate, ...fields };
    const updatedList = emailTemplates.map(t => t.id === updated.id ? updated : t);
    setEmailTemplates(updatedList);
  };

  const handleSaveCurrentTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTemplate) return;
    await saveEmailTemplate(selectedTemplate);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDuplicateTemplate = async () => {
    if (!selectedTemplate) return;
    const duplicated = await duplicateEmailTemplate(selectedTemplate.id);
    if (duplicated) {
      const refreshed = getEmailTemplates();
      setEmailTemplates(refreshed);
      setSelectedTemplateId(duplicated.id);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    if (selectedTemplate.isSystemDefault) {
      alert("System default master templates cannot be deleted, but you can set their status to 'Inactive'.");
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete the template "${selectedTemplate.name}"?`)) {
      await deleteEmailTemplate(selectedTemplate.id);
      const refreshed = getEmailTemplates();
      setEmailTemplates(refreshed);
      setSelectedTemplateId(refreshed[0]?.id || '');
    }
  };

  const handleCreateNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    const newId = `custom-${newTemplateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36).slice(-4)}`;
    const newTmpl: EmailTemplate = {
      id: newId,
      name: newTemplateName.trim(),
      description: `Custom ${newTemplateCategory} email template`,
      category: newTemplateCategory,
      status: 'Draft',
      isSystemDefault: false,
      subject: `Notice: {{course_title}} - {{site_name}}`,
      headline: `Important Notice from {{site_name}}`,
      badgeText: 'Notice',
      body: `Dear {{student_name}},\n\nWe would like to share an update regarding your training with **{{site_name}}**.\n\n### Details:\n- **Course:** {{course_title}}\n- **Date:** {{current_date}}\n\nPlease review your portal for further information.`,
      plainText: `Dear {{student_name}},\n\nUpdate regarding {{course_title}} on {{current_date}}.\nPlease visit {{site_url}}.`,
      buttonText: 'Visit Student Portal',
      buttonUrl: 'https://skylarasia.com/student-info',
      footerNote: 'Skylar Education Asia Inc. • Angeles City Training Centre',
      updatedAt: new Date().toISOString()
    };
    await saveEmailTemplate(newTmpl);
    const refreshed = getEmailTemplates();
    setEmailTemplates(refreshed);
    setSelectedTemplateId(newId);
    setNewTemplateName('');
    setNewTemplateModalOpen(false);
  };

  const handleResetTemplates = async () => {
    if (window.confirm("Are you sure you want to reset all email templates to default master designs?")) {
      await resetEmailTemplates();
      const defaults = getEmailTemplates();
      setEmailTemplates(defaults);
      setSelectedTemplateId(defaults[0]?.id || 'inquiry-confirmation');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSendTestEmail = async () => {
    if (!selectedTemplate || !testEmailRecipient) return;
    setSendingTestEmail(true);
    setTestEmailStatus(null);
    setTestEmailProgressMessage('Initializing SMTP socket handshake...');

    const res = await sendCustomTemplateEmail(
      selectedTemplate, 
      testEmailRecipient, 
      undefined, 
      (_stage, message) => {
        setTestEmailProgressMessage(message);
      }
    );

    setTestEmailStatus(res);
    setSendingTestEmail(false);
    setTestEmailProgressMessage('');
    setEmailLogsState(getEmailLogs());
  };

  const handleRetryLog = async (log: EmailLog) => {
    setRetryingLogId(log.id);
    const res = await retryEmailLog(log);
    setRetryingLogId(null);
    setEmailLogsState(getEmailLogs());
    if (res.success) {
      alert(`Retry Successful: ${res.message}`);
    } else {
      alert(`Retry Failed: ${res.message}`);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm("Clear all email activity logs?")) {
      clearEmailLogs();
      setEmailLogsState([]);
    }
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    saveSmtpSettings(smtpSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    setSmtpTestResult(null);
    setSmtpLiveSteps([]);
    setSmtpActiveStepId('dns');

    const result = await testSmtpConnection(smtpSettings, (updatedSteps, activeStepId) => {
      setSmtpLiveSteps([...updatedSteps]);
      setSmtpActiveStepId(activeStepId);
    });

    setSmtpTestResult(result);
    setSmtpLiveSteps(result.steps || []);
    setSmtpActiveStepId(null);
    setSmtpTesting(false);
    setSmtpSettingsState(getSmtpSettings());
    setEmailLogsState(getEmailLogs());
  };

  // Modal / Form States
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Staff' });

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] as string[] });

  // Storage Metrics State
  const [metrics, setMetrics] = useState({
    totalBytes: 0,
    coursesCount: 0,
    studentsCount: 0,
    logsCount: 0
  });

  useEffect(() => {
    // Calculate storage stats
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key);
        if (val) {
          total += (key.length + val.length) * 2; // approximation in UTF-16 bytes
        }
      }
    }
    setMetrics({
      totalBytes: total,
      coursesCount: getCourses().length,
      studentsCount: getStudents().length,
      logsCount: getAuditLogs().length
    });
  }, [adminUsers, roles, settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'light' | 'dark' | 'sticky' | 'loading' | 'favicon' | 'collapsed' | 'uncollapsed') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image file size exceeds 10MB. Please select a smaller file.");
        e.target.value = '';
        return;
      }
      setIsUploadingLogo(true);
      try {
        const mediaData = await firebaseClient.uploadMedia(file, 'branding', `${type}_logo_${Date.now()}.png`);
        setSettings(prev => {
          const next = { ...prev };
          if (type === 'main') next.mainLogoUrl = mediaData;
          else if (type === 'light') next.lightLogoUrl = mediaData;
          else if (type === 'dark') next.darkLogoUrl = mediaData;
          else if (type === 'sticky') next.stickyLogoUrl = mediaData;
          else if (type === 'loading') next.loadingLogoUrl = mediaData;
          else if (type === 'favicon') next.faviconUrl = mediaData;
          else if (type === 'collapsed') next.collapsedLogoUrl = mediaData;
          else if (type === 'uncollapsed') next.uncollapsedLogoUrl = mediaData;
          saveSettings(next);
          return next;
        });
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setSettings(prev => {
            const next = { ...prev };
            if (type === 'main') next.mainLogoUrl = base64;
            else if (type === 'light') next.lightLogoUrl = base64;
            else if (type === 'dark') next.darkLogoUrl = base64;
            else if (type === 'sticky') next.stickyLogoUrl = base64;
            else if (type === 'loading') next.loadingLogoUrl = base64;
            else if (type === 'favicon') next.faviconUrl = base64;
            else if (type === 'collapsed') next.collapsedLogoUrl = base64;
            else if (type === 'uncollapsed') next.uncollapsedLogoUrl = base64;
            saveSettings(next);
            return next;
          });
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingLogo(false);
        e.target.value = '';
      }
    }
  };

  const handleClearBranding = () => {
    if (window.confirm("Are you sure you want to clear all custom logos and restore default branding?")) {
      const resetSettings = {
        ...settings,
        mainLogoUrl: '',
        lightLogoUrl: '',
        darkLogoUrl: '',
        stickyLogoUrl: '',
        loadingLogoUrl: '',
        faviconUrl: '',
        collapsedLogoUrl: '',
        uncollapsedLogoUrl: '',
        brandColor: '#041024',
        accentColor: '#ffc107',
        borderRadius: 12,
        sidebarTheme: 'dark' as const,
        themePreset: 'navy' as const
      };
      setSettings(resetSettings);
      saveSettings(resetSettings);
    }
  };

  const handleDeleteLogo = (type: 'main' | 'light' | 'dark' | 'sticky' | 'loading' | 'favicon' | 'collapsed' | 'uncollapsed') => {
    if (window.confirm(`Are you sure you want to clear this custom ${type === 'favicon' ? 'favicon' : type + ' logo'}?`)) {
      setSettings(prev => {
        const next = { ...prev };
        if (type === 'main') next.mainLogoUrl = '';
        else if (type === 'light') next.lightLogoUrl = '';
        else if (type === 'dark') next.darkLogoUrl = '';
        else if (type === 'sticky') next.stickyLogoUrl = '';
        else if (type === 'loading') next.loadingLogoUrl = '';
        else if (type === 'favicon') next.faviconUrl = '';
        else if (type === 'collapsed') next.collapsedLogoUrl = '';
        else if (type === 'uncollapsed') next.uncollapsedLogoUrl = '';
        saveSettings(next);
        return next;
      });
    }
  };

  // User Actions
  const handleOpenUserModal = (user: AdminUser | null = null) => {
    if (user) {
      setSelectedUser(user);
      setUserForm({ name: user.name, email: user.email, role: user.role });
    } else {
      setSelectedUser(null);
      setUserForm({ name: '', email: '', role: 'Staff' });
    }
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUser = {
      id: selectedUser ? selectedUser.id : 'admin-' + Date.now(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      lastActive: selectedUser ? selectedUser.lastActive : 'Never',
      status: 'Active'
    };
    saveAdminUser(newUser);
    setAdminUsers(getAdminUsers());
    setUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Remove this admin user?")) {
      deleteAdminUser(id);
      setAdminUsers(getAdminUsers());
    }
  };

  // Role Actions
  const handleOpenRoleModal = (role: Role | null = null) => {
    if (role) {
      setSelectedRole(role);
      setRoleForm({ 
        name: role.name, 
        description: role.description, 
        permissions: role.permissions || ['view_courses'] 
      });
    } else {
      setSelectedRole(null);
      setRoleForm({ name: '', description: '', permissions: ['view_courses'] });
    }
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRoles = [...roles];
    const newRole: Role = {
      id: selectedRole ? selectedRole.id : 'role-' + Date.now(),
      name: roleForm.name,
      description: roleForm.description,
      usersCount: selectedRole ? selectedRole.usersCount : 0,
      permissions: roleForm.permissions
    };

    const idx = updatedRoles.findIndex(r => r.id === newRole.id);
    if (idx >= 0) {
      updatedRoles[idx] = newRole;
    } else {
      updatedRoles.push(newRole);
    }
    localStorage.setItem('apex_roles_data', JSON.stringify(updatedRoles));
    setRoles(updatedRoles);
    setRoleModalOpen(false);
  };

  const handleTogglePermission = (permission: string) => {
    setRoleForm(prev => {
      const perms = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: perms };
    });
  };

  const updateExtendedSettings = (updates: Partial<ExtendedSystemSettings>) => {
    setExtendedSettings(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleSaveExtendedSettings = async () => {
    setIsSavingExtended(true);
    await saveExtendedSettings(extendedSettings, 'Super Administrator', `Updated ${activeTab} configurations`);
    setIsDirty(false);
    setIsSaved(true);
    setIsSavingExtended(false);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCancelExtendedSettings = () => {
    setExtendedSettings(getExtendedSettings());
    setIsDirty(false);
  };

  const handleResetDefaultExtendedSettings = async () => {
    if (window.confirm("Restore entire system configuration back to factory baseline standards? All custom overrides will be reset.")) {
      await saveExtendedSettings(DEFAULT_EXTENDED_SETTINGS, 'Super Administrator', 'Restored system configuration to factory defaults');
      setExtendedSettings(DEFAULT_EXTENDED_SETTINGS);
      setIsDirty(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const refreshAllSettings = () => {
    setExtendedSettings(getExtendedSettings());
    setSettings(getSettings());
    setAuditLogs(getAuditLogs());
  };

  return (
    <div className="animate-fade-in-up space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white flex items-center gap-3">
            <span>Admin Settings & Enterprise Configuration Center</span>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
              v2.8 Enterprise
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure global parameters, brand assets, payment links, security access, edge CDN, and live system diagnostics.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[750px] flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 bg-gray-900 border-r border-gray-800 flex-shrink-0">
          <SettingsNavigation
            activeTab={activeTab as SettingsTabId}
            onSelectTab={(tab) => setActiveTab(tab)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 bg-gray-950 text-gray-100 overflow-y-auto">
          
          {/* SYSTEM TAB */}
          {activeTab === 'system' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">General Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Basic identity details about your training institute.</p>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Institute Name</label>
                      <input 
                        id="settings-institute-name"
                        name="instituteName"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.instituteName} 
                        onChange={e => setSettings({...settings, instituteName: e.target.value})} 
                        required
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Tax ID / Business Registration No.</label>
                      <input 
                        id="settings-tax-id"
                        name="taxId"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.taxId || ''} 
                        onChange={e => setSettings({...settings, taxId: e.target.value})} 
                        placeholder="e.g. TIN: SK-PH-2026-001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Support Helpline Email</label>
                      <input 
                        type="email"
                        id="settings-helpline-email"
                        name="contactEmail"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.contactEmail} 
                        onChange={e => setSettings({...settings, contactEmail: e.target.value})} 
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Contact Phone</label>
                      <input 
                        id="settings-phone"
                        name="contactPhone"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.contactPhone} 
                        onChange={e => setSettings({...settings, contactPhone: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Operating Hours</label>
                      <input 
                        id="settings-hours"
                        name="operatingHours"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.operatingHours} 
                        onChange={e => setSettings({...settings, operatingHours: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Support Representative Name</label>
                      <input 
                        id="settings-support-name"
                        name="supportContactName"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.supportContactName || ''} 
                        onChange={e => setSettings({...settings, supportContactName: e.target.value})} 
                        placeholder="e.g. Administrator Team"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Support Working Schedule</label>
                      <input 
                        id="settings-support-schedule"
                        name="supportHours"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.supportHours || ''} 
                        onChange={e => setSettings({...settings, supportHours: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Physical Address</label>
                    <input 
                      id="settings-address"
                      name="address"
                      autoComplete="off"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                      value={settings.address} 
                      onChange={e => setSettings({...settings, address: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Footer Description (Below Logo)</label>
                    <textarea 
                      id="settings-footer-desc"
                      name="footerDescription"
                      autoComplete="off"
                      className="w-full p-3 h-20 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white text-xs leading-relaxed" 
                      value={settings.footerDescription || ''} 
                      onChange={e => setSettings({...settings, footerDescription: e.target.value})} 
                      placeholder="Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia)..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Banner Site Announcement</label>
                    <textarea 
                      id="settings-announcement"
                      name="siteAnnouncement"
                      autoComplete="off"
                      className="w-full p-3 h-24 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                      value={settings.siteAnnouncement} 
                      onChange={e => setSettings({...settings, siteAnnouncement: e.target.value})} 
                      placeholder="Enter alerts, updates, or maintenance warnings to display on frontend headers..."
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <Button type="submit" className="w-40 shadow-lg flex items-center justify-center gap-2">
                  {isSaved ? <span className="flex items-center gap-1.5"><Check size={16}/> Saved</span> : <span className="flex items-center gap-1.5"><Save size={16}/> Save Changes</span>}
                </Button>
              </div>
            </form>
          )}

          {/* ENROLLMENT TAB */}
          {activeTab === 'enrollment' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Enrollment Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage tuition conditions, active intake years, and application caps.</p>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                    <div>
                      <h4 className="font-bold text-gray-700 dark:text-white">Accept Public Applications</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Toggle whether students can fill and submit training registrations online.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, enrollmentOpen: !settings.enrollmentOpen})}
                      className={`${settings.enrollmentOpen ? 'text-green-500' : 'text-gray-300'} transition-colors focus:outline-none`}
                    >
                      {settings.enrollmentOpen ? <ToggleRight size={44} className="fill-current"/> : <ToggleLeft size={44}/>}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Current Active Academic Term</label>
                    <input 
                      id="settings-term"
                      name="currentTerm"
                      autoComplete="off"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                      value={settings.currentTerm || ''} 
                      onChange={e => setSettings({...settings, currentTerm: e.target.value})}
                      placeholder="e.g. Fall Term, Semester 2, 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Enrollment Cutoff Date</label>
                    <input 
                      type="date"
                      id="settings-cutoff-date"
                      name="enrollmentDeadline"
                      autoComplete="off"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                      value={settings.enrollmentDeadline || ''} 
                      onChange={e => setSettings({...settings, enrollmentDeadline: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Tuition Currency</label>
                      <select
                        id="settings-currency"
                        name="tuitionCurrency"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                        value={settings.tuitionCurrency || 'AUD'}
                        onChange={e => setSettings({...settings, tuitionCurrency: e.target.value})}
                      >
                        <option value="AUD">AUD ($)</option>
                        <option value="USD">USD ($)</option>
                        <option value="PHP">PHP (₱)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Class Size Limit (Cap)</label>
                      <input 
                        type="number"
                        id="settings-class-size"
                        name="classSizeLimit"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                        value={settings.classSizeLimit || 20} 
                        onChange={e => setSettings({...settings, classSizeLimit: parseInt(e.target.value) || 20})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Passing Assessment %</label>
                      <input 
                        type="number"
                        id="settings-passing-score"
                        name="passingScore"
                        autoComplete="off"
                        min="0"
                        max="100"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                        value={settings.passingScore || 80} 
                        onChange={e => setSettings({...settings, passingScore: parseInt(e.target.value) || 80})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <Button type="submit" className="w-40 shadow-lg flex items-center justify-center gap-2">
                  {isSaved ? <span className="flex items-center gap-1.5"><Check size={16}/> Saved</span> : <span className="flex items-center gap-1.5"><Save size={16}/> Save Config</span>}
                </Button>
              </div>
            </form>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 w-full animate-fade-in">
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 dark:border-gray-700 pb-4 mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-secondary dark:text-white mb-1 font-heading">Branding & Theme Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure visual themes, custom colors, typography layout, border radii, and logo branding options for the application.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClearBranding}
                      className="px-4 py-2 border border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/20 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all flex items-center gap-1.5 focus:outline-none"
                    >
                      <RefreshCw size={13} className="animate-spin-hover" /> Reset Theme
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Left Column: Form Controls */}
                  <div className="space-y-6">
                    
                    {/* Grid of basic configuration blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Theme Presets & Modes Box */}
                      <div className="bg-slate-50/50 dark:bg-gray-900/10 p-5 rounded-2xl border border-slate-100 dark:border-gray-805 space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-yellow-500" /> Presets & Modes
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Theme Template Preset</label>
                              <select
                                id="settings-theme-preset"
                                name="themePreset"
                                autoComplete="off"
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white font-semibold text-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={settings.themePreset || 'navy'}
                                onChange={e => {
                                  const val = e.target.value as any;
                                  let color = '#041024';
                                  let accent = '#ffc107';
                                  if (val === 'dark') { color = '#111827'; accent = '#3b82f6'; }
                                  if (val === 'emerald') { color = '#065f46'; accent = '#10b981'; }
                                  if (val === 'crimson') { color = '#991b1b'; accent = '#ef4444'; }
                                  setSettings({ ...settings, themePreset: val, brandColor: color, accentColor: accent });
                                }}
                              >
                                <option value="navy">Sleek Navy Blue (Brand Default)</option>
                                <option value="dark">Classic Solid Dark</option>
                                <option value="emerald">Emerald Forest Safety</option>
                                <option value="crimson">Crimson Red Fire Rescue</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Sidebar Style Mode</label>
                              <select
                                id="settings-sidebar-theme"
                                name="sidebarTheme"
                                autoComplete="off"
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white font-semibold text-sm shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={settings.sidebarTheme || 'dark'}
                                onChange={e => setSettings({...settings, sidebarTheme: e.target.value as any})}
                              >
                                <option value="dark">Dark Sidebar (Professional Contrast)</option>
                                <option value="light">Light Sidebar (Minimalist Slate)</option>
                                <option value="color">Brand Color Sidebar (Vibrant Accent)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 flex items-center justify-between shadow-sm">
                          <div>
                            <h5 className="font-bold text-gray-750 dark:text-white text-xs">Default Dark Mode</h5>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Initialize site in dark theme by default</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setSettings({...settings, defaultDarkMode: !settings.defaultDarkMode})}
                            className={`${settings.defaultDarkMode ? 'text-primary dark:text-blue-400' : 'text-gray-300'} transition-colors focus:outline-none`}
                          >
                            {settings.defaultDarkMode ? <ToggleRight size={40} className="fill-current"/> : <ToggleLeft size={40}/>}
                          </button>
                        </div>
                      </div>

                      {/* Color Palette customization */}
                      <div className="bg-slate-50/50 dark:bg-gray-900/10 p-5 rounded-2xl border border-slate-100 dark:border-gray-805 space-y-4">
                        <h4 className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 flex items-center gap-1.5">
                          <Palette size={14} className="text-primary dark:text-blue-400" /> Color Customization Engine
                        </h4>

                        <div className="space-y-4">
                          {/* Brand Primary Color */}
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Primary Brand Color</label>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <input 
                                  type="color" 
                                  id="settings-primary-color"
                                  name="brandColor"
                                  autoComplete="off"
                                  value={settings.brandColor || '#041024'}
                                  onChange={e => setSettings({...settings, brandColor: e.target.value})}
                                  className="w-11 h-11 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-105"
                                />
                              </div>
                              <input 
                                type="text" 
                                id="settings-primary-hex"
                                name="brandColorHex"
                                autoComplete="off"
                                value={settings.brandColor || '#041024'}
                                onChange={e => setSettings({...settings, brandColor: e.target.value})}
                                placeholder="#041024"
                                className="flex-1 p-2.5 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-mono text-sm uppercase shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                          </div>

                          {/* Accent Color */}
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Accent Highlight Color</label>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <input 
                                  type="color" 
                                  id="settings-accent-color"
                                  name="accentColor"
                                  autoComplete="off"
                                  value={settings.accentColor || '#ffc107'}
                                  onChange={e => setSettings({...settings, accentColor: e.target.value})}
                                  className="w-11 h-11 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-105"
                                />
                              </div>
                              <input 
                                type="text" 
                                id="settings-accent-hex"
                                name="accentColorHex"
                                autoComplete="off"
                                value={settings.accentColor || '#ffc107'}
                                onChange={e => setSettings({...settings, accentColor: e.target.value})}
                                placeholder="#FFC107"
                                className="flex-1 p-2.5 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white font-mono text-sm uppercase shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed italic">
                            Primary color sets headers, primary buttons, and main overlays. Accent color powers active navigation states, badges, and warning indicators.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Typography, Border Radius, Layout Block */}
                    <div className="bg-white dark:bg-gray-800/40 p-5 rounded-2xl border border-slate-200 dark:border-gray-750 space-y-6">
                      <h4 className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-750 pb-2 flex items-center gap-1.5">
                        <Type size={14} className="text-purple-500" /> Typography, Spacing & Borders
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Font family</label>
                          <select
                            id="settings-font"
                            name="fontFamily"
                            autoComplete="off"
                            className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white font-semibold text-xs shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={settings.fontFamily || 'Outfit'}
                            onChange={e => setSettings({...settings, fontFamily: e.target.value})}
                          >
                            <option value="Outfit">Outfit & Inter (Modern, Clean)</option>
                            <option value="Poppins">Poppins & Roboto (Friendly, Round)</option>
                            <option value="Montserrat">Montserrat (Technical, Strong)</option>
                            <option value="System">Browser System Default Fonts</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Layout Spacing style</label>
                          <select
                            id="settings-layout"
                            name="layoutStyle"
                            autoComplete="off"
                            className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white font-semibold text-xs shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={settings.layoutStyle || 'wide'}
                            onChange={e => setSettings({...settings, layoutStyle: e.target.value as any})}
                          >
                            <option value="wide">Full Viewport width (Fluid Layout)</option>
                            <option value="boxed">Boxed (Contained 1280px maximum)</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Border Radius Corners</label>
                            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 rounded-lg">{settings.borderRadius !== undefined ? settings.borderRadius : 12}px</span>
                          </div>
                          <div className="pt-2">
                            <input 
                              type="range" 
                              id="settings-border-radius"
                              name="borderRadius"
                              autoComplete="off"
                              min="0" 
                              max="24" 
                              step="2"
                              value={settings.borderRadius !== undefined ? settings.borderRadius : 12}
                              onChange={e => setSettings({...settings, borderRadius: parseInt(e.target.value)})}
                              className="w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono">
                              <span>Sharp (0px)</span>
                              <span>Pill (24px)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Asset Uploaders Grid */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 gap-3">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
                          <Image size={18} className="text-primary dark:text-accent" /> 
                          Logo Assets Management
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                          PNG, SVG or JPEG (Max 2MB)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Brand Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group md:col-span-2">
                          {settings.mainLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('main')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white">Main Brand Logo (Primary)</h5>
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">Global Default</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Used across public website headers, admin sidebar, and primary navigation branding.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-32 bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.mainLogoUrl ? (
                                <img src={settings.mainLogoUrl} alt="Main logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT /skylar-logo.svg ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload Main Brand Logo
                              <input type="file" name="mainLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'main')} />
                            </label>
                          </div>
                        </div>

                        {/* Light Mode Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.lightLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('light')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Light Mode Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed on light backgrounds and panels.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.lightLogoUrl ? (
                                <img src={settings.lightLogoUrl} alt="Light logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="lightLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'light')} />
                            </label>
                          </div>
                        </div>

                        {/* Dark Mode Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.darkLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('dark')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Dark Mode Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed on dark backgrounds and footers.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-[#0B172A] rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-800 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.darkLogoUrl ? (
                                <img src={settings.darkLogoUrl} alt="Dark logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="darkLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'dark')} />
                            </label>
                          </div>
                        </div>

                        {/* Sticky Header Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.stickyLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('sticky')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Sticky Header Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed in top navigation bar when scrolled/sticky.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.stickyLogoUrl ? (
                                <img src={settings.stickyLogoUrl} alt="Sticky header logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="stickyLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'sticky')} />
                            </label>
                          </div>
                        </div>

                        {/* Loading Screen Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.loadingLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('loading')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Loading Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed centrally on loading splash screens.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.loadingLogoUrl ? (
                                <img src={settings.loadingLogoUrl} alt="Loading logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="loadingLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'loading')} />
                            </label>
                          </div>
                        </div>

                        {/* Favicon Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.faviconUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('favicon')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Browser Favicon</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tiny icon shown in the browser tab (16x16 or 32x32).</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.faviconUrl ? (
                                <img src={settings.faviconUrl} alt="Favicon preview" className="w-12 h-12 object-contain rounded-md shadow-sm bg-white p-1" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="favicon" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'favicon')} />
                            </label>
                          </div>
                        </div>

                        {/* Collapsed Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.collapsedLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('collapsed')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Collapsed Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed in sidebar when collapsed (icon only).</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.collapsedLogoUrl ? (
                                <img src={settings.collapsedLogoUrl} alt="Collapsed logo preview" className="w-12 h-12 object-contain" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="collapsedLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'collapsed')} />
                            </label>
                          </div>
                        </div>

                        {/* Uncollapsed Logo */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative group">
                          {settings.uncollapsedLogoUrl && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLogo('uncollapsed')}
                              className="absolute top-4 right-4 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors z-10"
                              title="Delete Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Uncollapsed Logo</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed in sidebar when expanded.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="h-28 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-primary/50 dark:group-hover:border-accent/50 transition-colors">
                              {settings.uncollapsedLogoUrl ? (
                                <img src={settings.uncollapsedLogoUrl} alt="Uncollapsed logo preview" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">DEFAULT ACTIVE</span>
                              )}
                            </div>
                            <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all active:scale-[0.98]">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" name="uncollapsedLogo" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'uncollapsed')} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Custom CSS Overrides with cheat sheet */}
                    <div className="bg-white dark:bg-gray-800/40 p-5 rounded-2xl border border-slate-200 dark:border-gray-750 space-y-4 animate-fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-150 dark:border-gray-750 pb-2">
                        <h4 className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Code size={14} className="text-blue-500" /> Advanced CSS Overrides
                        </h4>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <ShieldAlert size={12} /> Custom developer style injector active.
                        </span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">CSS Injector Code</label>
                          <textarea
                            id="settings-custom-css"
                            name="customCss"
                            autoComplete="off"
                            rows={4}
                            value={settings.customCss || ''}
                            onChange={e => setSettings({...settings, customCss: e.target.value})}
                            placeholder="/* E.g. \nbody {\n  letter-spacing: 0.01em;\n}\n.custom-btn {\n  box-shadow: 0 4px 14px rgba(0,0,0,0.1);\n} */"
                            className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                          />
                        </div>
                        <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-gray-750 space-y-2">
                          <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Style Tokens Cheat Sheet</h5>
                          <div className="space-y-1.5 text-[10.5px] font-medium text-gray-600 dark:text-gray-400 font-mono leading-relaxed">
                            <div><span className="text-blue-500 font-bold">--color-primary</span>: Brand base</div>
                            <div><span className="text-yellow-600 dark:text-yellow-500 font-bold">--color-accent</span>: Highlight theme</div>
                            <div><span className="text-purple-500 font-bold">--radius-base</span>: Corners px</div>
                            <div><span className="text-emerald-500 font-bold">--font-sans</span>: Primary typography</div>
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal pt-1.5 border-t border-slate-200/60 dark:border-gray-800">
                            Updates are compiled instantly and deployed globally across all public client viewports.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Micro-animations dropdown */}
                        <div className="bg-slate-50/50 dark:bg-gray-900/10 p-4 rounded-xl border border-slate-100 dark:border-gray-805">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity size={14} className="text-emerald-500" />
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Micro-Animations Speed</label>
                          </div>
                          <select
                            id="settings-animation-speed"
                            name="animationSpeed"
                            autoComplete="off"
                            className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-xl dark:text-white font-semibold text-xs shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={settings.animationSpeed || 'smooth'}
                            onChange={e => setSettings({...settings, animationSpeed: e.target.value as any})}
                          >
                            <option value="smooth">Smooth & Fluid (Default Kinetics)</option>
                            <option value="fast">Snappy & Quick (Optimized Transitions)</option>
                            <option value="disabled">Disabled (Static Render Modes)</option>
                          </select>
                        </div>

                        {/* Layout alignment preview helper */}
                        <div className="bg-slate-50/50 dark:bg-gray-900/10 p-4 rounded-xl border border-slate-100 dark:border-gray-805 flex items-center justify-between">
                          <div className="space-y-1">
                            <h5 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <Monitor size={14} className="text-blue-500" /> Fully Responsive Grid
                            </h5>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Layout adjusts container dynamically for mobile and desktop screens.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <Button type="submit" className="w-44 shadow-lg flex items-center justify-center gap-2">
                  {isSaved ? <span className="flex items-center gap-1.5"><Check size={16}/> Settings Saved</span> : <span className="flex items-center gap-1.5"><Save size={16}/> Save Appearance</span>}
                </Button>
              </div>
            </form>
          )}

          {/* ROLES TAB */}
          {activeTab === 'roles' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Roles & Permissions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage detailed authorization matrices and access controls for your administrators.</p>
                </div>
                <Button onClick={() => handleOpenRoleModal(null)} size="sm" className="flex items-center gap-1.5">
                  <Plus size={16} /> Add Custom Role
                </Button>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Role Name</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Permissions Active</th>
                      <th className="px-6 py-4">Users Assigned</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {roles.map(role => (
                      <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{role.name}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">{role.description}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(role.permissions || ['view_courses']).map(p => (
                              <span key={p} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                {p.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold">
                            {role.usersCount} Members
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 whitespace-nowrap">
                          <button onClick={() => handleOpenRoleModal(role)} className="hover:text-primary mr-3 text-gray-500 dark:text-gray-400" title="Edit Permissions">
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDIT LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Audit Logs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track and review administrative actions and website updates.</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Time</th>
                      <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Admin User</th>
                      <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Scope</th>
                      <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Action</th>
                      <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Activity Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {auditLogs.length === 0 ? (
                      <tr><td colSpan={5} className="p-6 text-center text-gray-500">No activity recorded.</td></tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-6 py-4 font-bold text-gray-800 dark:text-white whitespace-nowrap">{log.adminName}</td>
                          <td className="px-6 py-4 text-xs font-bold uppercase text-gray-400 whitespace-nowrap">{log.module}</td>
                          <td className="px-6 py-4 font-medium text-primary dark:text-blue-400 whitespace-nowrap">{log.action}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300 truncate max-w-sm" title={log.details}>{log.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Admin Users</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure administrative access keys and team staff credentials.</p>
                </div>
                <Button onClick={() => handleOpenUserModal(null)} size="sm" className="flex items-center gap-1.5">
                  <Plus size={16} /> Add User
                </Button>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Assigned Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Login</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {adminUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{user.lastActive}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button onClick={() => handleOpenUserModal(user)} className="text-gray-500 dark:text-gray-400 hover:text-primary mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BACKUP & RESTORE TAB */}
          {activeTab === 'backup' && (
            <div className="animate-fade-in space-y-8 max-w-3xl">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Database Backup & Recovery</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Backup all course descriptions, configurations, and records, or reset to factory defaults.</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Local Database Size</div>
                  <div className="text-lg font-bold text-secondary dark:text-white font-mono">{(metrics.totalBytes / 1024).toFixed(2)} KB</div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Courses Count</div>
                  <div className="text-lg font-bold text-secondary dark:text-white font-mono">{metrics.coursesCount} Items</div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Registered Students</div>
                  <div className="text-lg font-bold text-secondary dark:text-white font-mono">{metrics.studentsCount} Accounts</div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">System Logs</div>
                  <div className="text-lg font-bold text-secondary dark:text-white font-mono">{metrics.logsCount} Entries</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Export Section */}
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <Download size={18} className="text-primary dark:text-blue-400" /> Export Database File
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Download a full snapshot of your current database state as a JSON file. Use this to secure safety records or migrate databases.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      const backupData: Record<string, string | null> = {};
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('apex_')) {
                          backupData[key] = localStorage.getItem(key);
                        }
                      }
                      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `skylar-asia-backup-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }} 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download Backup (.json)
                  </Button>
                </div>
                
                {/* Import Section */}
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <UploadCloud size={18} className="text-green-600 dark:text-green-400" /> Import Database File
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Restore files from a valid JSON snapshot. <span className="text-red-500 font-bold">Caution:</span> This replaces all database indices and reloads the admin panel.</p>
                  </div>
                  <label className="cursor-pointer block text-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 text-sm font-semibold dark:text-white transition-all shadow-sm">
                    Choose Backup File
                    <input 
                      type="file" 
                      id="settings-import-file"
                      name="importFile"
                      autoComplete="off"
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const backupData = JSON.parse(event.target?.result as string);
                              let importedCount = 0;
                              Object.keys(backupData).forEach(key => {
                                if (key.startsWith('apex_') && backupData[key] !== null) {
                                  localStorage.setItem(key, backupData[key]);
                                  importedCount++;
                                }
                              });
                              alert(`Database restored successfully! ${importedCount} keys imported. The portal will now reload.`);
                              window.location.reload();
                            } catch (err) {
                              alert("Invalid backup file format. Please upload a valid JSON backup.");
                            }
                          };
                          reader.readAsText(file);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>

              {/* Reset Factory seeds */}
              <div className="p-5 border border-red-200 dark:border-red-900/35 rounded-xl bg-red-50/50 dark:bg-red-950/10 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-1.5 text-sm">
                    <ShieldAlert size={18} /> Restore Default Factory Seeds
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Resets local data storage back to original production initial defaults. This resets all custom settings.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("WARNING: This will completely wipe all local storage data, including courses, students, system files, and restore original seed files. Proceed?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          )}

          {/* SMTP TAB */}
          {activeTab === 'smtp' && (
            <form onSubmit={handleSaveSmtp} className="space-y-8 max-w-4xl animate-fade-in text-gray-200">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800 mb-6">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                      <Mail className="text-amber-500" size={22} />
                      SMTP Email Transaction Server
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Configure outgoing authenticated mail server for automated student notifications, inquiry responses, and admin alerts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      validateSmtpConfiguration(smtpSettings).valid
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${validateSmtpConfiguration(smtpSettings).valid ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      {validateSmtpConfiguration(smtpSettings).valid ? 'SMTP Configured' : 'Setup Incomplete'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('email-templates')}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText size={13} className="text-amber-400" /> View Templates
                    </button>
                  </div>
                </div>
                
                {/* REAL-TIME LIVE SMTP DIAGNOSTIC CONSOLE */}
                {(smtpTesting || smtpTestResult || smtpLiveSteps.length > 0) && (
                  <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/90 shadow-xl overflow-hidden backdrop-blur-sm transition-all animate-fade-in">
                    {/* Console Header */}
                    <div className="px-5 py-3.5 bg-gray-950/80 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${smtpTesting ? 'bg-amber-400 animate-ping' : smtpTestResult?.success ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                          <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                        </div>
                        <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-300 flex items-center gap-1.5">
                          <Activity size={14} className={smtpTesting ? 'text-amber-400 animate-spin' : smtpTestResult?.success ? 'text-emerald-400' : 'text-rose-400'} />
                          Live SMTP Handshake Diagnostics
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {smtpTesting && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            PROBING SOCKET...
                          </span>
                        )}
                        {!smtpTesting && smtpTestResult && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 ${
                            smtpTestResult.success
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {smtpTestResult.success ? 'HANDSHAKE VERIFIED' : 'HANDSHAKE FAILED'}
                          </span>
                        )}
                        {smtpTestResult?.totalLatencyMs !== undefined && (
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            RTT: {smtpTestResult.totalLatencyMs}ms
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step-by-Step Live Telemetry */}
                    <div className="p-4 sm:p-5 space-y-3 font-mono text-xs">
                      {smtpLiveSteps.map((step, idx) => {
                        const isCurrent = smtpActiveStepId === step.id;
                        return (
                          <div 
                            key={step.id} 
                            className={`p-3 rounded-xl border transition-all ${
                              step.status === 'success' 
                                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
                                : step.status === 'failed'
                                ? 'bg-rose-950/25 border-rose-800/50 text-rose-200'
                                : step.status === 'running' || isCurrent
                                ? 'bg-amber-950/25 border-amber-500/50 text-amber-200 shadow-sm ring-1 ring-amber-500/30'
                                : step.status === 'warning'
                                ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                                : 'bg-gray-950/40 border-gray-800/60 text-gray-400 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="font-bold tracking-tight text-white mr-2">{step.label}</span>
                                  {step.status === 'running' && (
                                    <span className="inline-block text-[10px] text-amber-400 animate-pulse">[TESTING...]</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {step.latencyMs !== undefined && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-gray-300 border border-gray-700">
                                    {step.latencyMs}ms
                                  </span>
                                )}
                                {step.status === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
                                {step.status === 'failed' && <AlertCircle size={16} className="text-rose-400" />}
                                {step.status === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                                {step.status === 'running' && <RefreshCw size={15} className="text-amber-400 animate-spin" />}
                                {step.status === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-gray-700"></span>}
                              </div>
                            </div>

                            <div className="mt-1.5 pl-7 text-[11px] leading-relaxed opacity-90">
                              {step.message}
                            </div>
                            {step.details && (
                              <div className="mt-1 pl-7 text-[10px] text-gray-400 font-sans italic">
                                &gt; {step.details}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Result Footer Summary */}
                    {smtpTestResult && (
                      <div className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        smtpTestResult.success 
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200' 
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {smtpTestResult.success ? (
                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold text-xs sm:text-sm">
                              {smtpTestResult.success ? 'SMTP Handshake Verified & Active' : 'SMTP Connection Diagnostic Failed'}
                            </div>
                            <div className="text-xs opacity-90 mt-0.5">{smtpTestResult.message}</div>
                          </div>
                        </div>

                        {smtpTestResult.success && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('email-templates');
                              setPreviewMode('visual');
                            }}
                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                          >
                            <Send size={13} /> Send Sample Test Email &rarr;
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label htmlFor="smtp-host" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        SMTP Server Host
                      </label>
                      <input 
                        id="smtp-host"
                        type="text"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.host}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, host: e.target.value })}
                        required
                        placeholder="e.g. smtp.gmail.com or mail.skylarasia.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="smtp-port" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        SMTP Port
                      </label>
                      <input 
                        id="smtp-port"
                        type="number"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.port}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, port: parseInt(e.target.value) || 587 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="smtp-encryption" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Encryption Protocol
                      </label>
                      <select
                        id="smtp-encryption"
                        value={smtpSettings.encryption || (smtpSettings.enableSsl ? 'SSL' : 'TLS')}
                        onChange={e => {
                          const val = e.target.value as 'TLS' | 'SSL' | 'None';
                          setSmtpSettingsState({ 
                            ...smtpSettings, 
                            encryption: val, 
                            enableSsl: val === 'SSL',
                            port: val === 'SSL' ? 465 : (val === 'TLS' ? 587 : 25)
                          });
                        }}
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white outline-none transition-colors cursor-pointer"
                      >
                        <option value="TLS" className="bg-gray-900 text-white">TLS (Recommended - Port 587)</option>
                        <option value="SSL" className="bg-gray-900 text-white">SSL (Port 465)</option>
                        <option value="None" className="bg-gray-900 text-white">None / Plain (Port 25)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="smtp-username" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        SMTP Username / API Key
                      </label>
                      <input 
                        id="smtp-username"
                        type="text"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.username}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, username: e.target.value })}
                        required
                        placeholder="user@example.com or api_key"
                      />
                    </div>

                    <div>
                      <label htmlFor="smtp-password" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        SMTP Password / Secret
                      </label>
                      <input 
                        id="smtp-password"
                        type="password"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.password || ''}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, password: e.target.value })}
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="smtp-sender-email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Sender Email (From Address)
                      </label>
                      <input 
                        id="smtp-sender-email"
                        type="email"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.fromEmail}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, fromEmail: e.target.value })}
                        required
                        placeholder="inquiries@skylaredasia.ph"
                      />
                    </div>

                    <div>
                      <label htmlFor="smtp-sender-name" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Sender Display Name
                      </label>
                      <input 
                        id="smtp-sender-name"
                        type="text"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.fromName}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, fromName: e.target.value })}
                        required
                        placeholder="SKYLAR EDUCATION ASIA Admissions"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label htmlFor="smtp-admin-email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                        Admin Notification Email
                      </label>
                      <input 
                        id="smtp-admin-email"
                        type="email"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors"
                        value={smtpSettings.adminNotificationEmail}
                        onChange={e => setSmtpSettingsState({ ...smtpSettings, adminNotificationEmail: e.target.value })}
                        placeholder="admissions@skylaredasia.ph"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4 sm:pt-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                        <input 
                          type="checkbox"
                          checked={smtpSettings.enableNotifications}
                          onChange={e => setSmtpSettingsState({ ...smtpSettings, enableNotifications: e.target.checked })}
                          className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-gray-900 border-gray-700"
                        />
                        Enable Admin Instant Email Alerts on New Inquiries
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800 flex flex-wrap gap-4 items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTestSmtp}
                      disabled={smtpTesting}
                      className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-gray-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Send size={15} className="text-amber-400" /> {smtpTesting ? 'Testing Handshake...' : 'Test SMTP Connection'}
                    </button>

                    <Button type="submit" className="shadow-md">
                      {isSaved ? <span className="flex items-center gap-1"><Check size={16} /> Saved</span> : 'Save SMTP Settings'}
                    </Button>
                  </div>

                  {/* Sync Notice Card */}
                  <div className="p-4 bg-gray-900/80 rounded-2xl border border-gray-800 flex items-start gap-3">
                    <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-gray-400 leading-relaxed">
                      <strong className="text-gray-200">Automatic Template Synchronization:</strong> All transactional email templates, test dispatches, and automated event notifications automatically route through this authenticated outgoing server. Sensitive passwords and API keys are stored securely.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* EMAIL TEMPLATES TAB */}
          {activeTab === 'email-templates' && (
            <div className="animate-fade-in space-y-6 w-full">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-secondary dark:text-white flex items-center gap-2">
                    <Mail className="text-amber-500" size={22} />
                    Transactional Email Templates
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Design and customize branded responsive HTML emails sent to candidates, sponsors, and admissions.
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTemplateModalOpen(true)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus size={13} className="text-amber-400" /> New Template
                  </button>
                  <button
                    type="button"
                    onClick={handleResetTemplates}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={13} /> Reset Defaults
                  </button>
                  <Button
                    type="button"
                    onClick={() => handleSaveCurrentTemplate()}
                    className="flex items-center gap-1.5 shadow-md"
                  >
                    {isSaved ? <span className="flex items-center gap-1"><Check size={16} /> Saved</span> : <span className="flex items-center gap-1"><Save size={16} /> Save Template</span>}
                  </Button>
                </div>
              </div>

              {/* SMTP Connection Sync Warning Banner if SMTP not configured */}
              {!validateSmtpConfiguration(smtpSettings).valid && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                    <span>
                      <strong>SMTP Synchronization Warning:</strong> Your outgoing SMTP server has not been verified yet. Real delivery and test dispatches require an active SMTP configuration.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('smtp')}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Configure SMTP
                  </button>
                </div>
              )}

              {/* Category Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                  <Filter size={11} /> Filter:
                </span>
                {['All', 'Contact', 'Inquiry', 'Student', 'Admin', 'Enrollment', 'Certification', 'Reminder', 'Welcome', 'Verification', 'Password Reset', 'Payment', 'Invoice', 'Security Alert'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTemplateCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      templateCategoryFilter === cat
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Selector Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                {emailTemplates
                  .filter(tmpl => templateCategoryFilter === 'All' || tmpl.category === templateCategoryFilter)
                  .map(tmpl => {
                    const isSelected = tmpl.id === selectedTemplateId;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id);
                          setTestEmailStatus(null);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500/60 dark:bg-amber-500/15 shadow-sm' 
                            : 'bg-white dark:bg-gray-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {tmpl.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              tmpl.status === 'Active' ? 'bg-emerald-500' : (tmpl.status === 'Draft' ? 'bg-amber-400' : 'bg-slate-400')
                            }`} title={`Status: ${tmpl.status || 'Active'}`} />
                            {isSelected && <CheckCircle2 size={14} className="text-amber-500" />}
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {tmpl.name}
                        </h4>
                      </button>
                    );
                  })}
              </div>

              {/* Main Workspace: 2-Column Split (Editor & Live Preview) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Left Column: Template Form & Merge Tags (7 Cols) */}
                <div className="lg:col-span-6 xl:col-span-6 space-y-5">
                  
                  {/* Template Meta & Action Header */}
                  <div className="bg-slate-50/70 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Sliders size={15} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Template Properties</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleDuplicateTemplate}
                          title="Duplicate this template"
                          className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} /> Duplicate
                        </button>
                        {!selectedTemplate.isSystemDefault && (
                          <button
                            type="button"
                            onClick={handleDeleteTemplate}
                            title="Delete custom template"
                            className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Template Name
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.name}
                          onChange={e => handleUpdateCurrentTemplate({ name: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Category / Type
                        </label>
                        <select
                          value={selectedTemplate.category}
                          onChange={e => handleUpdateCurrentTemplate({ category: e.target.value as EmailTemplateCategory })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                        >
                          <option value="Contact">Contact</option>
                          <option value="Inquiry">Inquiry</option>
                          <option value="Student">Student</option>
                          <option value="Admin">Admin</option>
                          <option value="Enrollment">Enrollment</option>
                          <option value="Certification">Certification</option>
                          <option value="Reminder">Reminder</option>
                          <option value="Welcome">Welcome</option>
                          <option value="Verification">Verification</option>
                          <option value="Password Reset">Password Reset</option>
                          <option value="Password Changed">Password Changed</option>
                          <option value="Account Created">Account Created</option>
                          <option value="Account Approved">Account Approved</option>
                          <option value="Account Suspended">Account Suspended</option>
                          <option value="Login Notification">Login Notification</option>
                          <option value="Security Alert">Security Alert</option>
                          <option value="Payment">Payment</option>
                          <option value="Invoice">Invoice</option>
                          <option value="System">System</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Status
                        </label>
                        <select
                          value={selectedTemplate.status || 'Active'}
                          onChange={e => handleUpdateCurrentTemplate({ status: e.target.value as EmailTemplateStatus })}
                          className={`w-full p-2.5 bg-white dark:bg-gray-800 border rounded-xl text-xs font-bold outline-none ${
                            (selectedTemplate.status || 'Active') === 'Active'
                              ? 'text-emerald-600 border-emerald-500/40'
                              : ((selectedTemplate.status) === 'Draft' ? 'text-amber-500 border-amber-500/40' : 'text-slate-400 border-slate-300 dark:border-slate-700')
                          }`}
                        >
                          <option value="Active">Active / Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Custom Sender Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder={smtpSettings.fromName || 'Default from SMTP'}
                          value={selectedTemplate.senderName || ''}
                          onChange={e => handleUpdateCurrentTemplate({ senderName: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Reply-To Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder={smtpSettings.fromEmail || 'Default from SMTP'}
                          value={selectedTemplate.replyToEmail || ''}
                          onChange={e => handleUpdateCurrentTemplate({ replyToEmail: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject & Header Fields */}
                  <div className="bg-slate-50/70 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/80 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={14} className="text-amber-500" /> Header &amp; Subject Details
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {selectedTemplate.id}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={selectedTemplate.subject}
                        onChange={e => handleUpdateCurrentTemplate({ subject: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Headline Banner Title
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.headline}
                          onChange={e => handleUpdateCurrentTemplate({ headline: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.badgeText || ''}
                          onChange={e => handleUpdateCurrentTemplate({ badgeText: e.target.value })}
                          placeholder="e.g. INQUIRY CONFIRMED"
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body Text Editor */}
                  <div className="bg-slate-50/70 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Email Body Content (Markdown Supported)
                      </label>
                      <span className="text-[10px] text-slate-400">Use **bold**, - list items, ### headers</span>
                    </div>

                    <textarea
                      rows={9}
                      value={selectedTemplate.body}
                      onChange={e => handleUpdateCurrentTemplate({ body: e.target.value })}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    />

                    {/* Plain Text Version Area */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Plain Text Version (Fallback)
                        </label>
                        <span className="text-[10px] text-slate-400">For non-HTML clients</span>
                      </div>
                      <textarea
                        rows={3}
                        value={selectedTemplate.plainText || ''}
                        placeholder="Fallback plain text version..."
                        onChange={e => handleUpdateCurrentTemplate({ plainText: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono leading-relaxed text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    {/* Quick Insert Merge Tags Toolbar */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-500" /> Click to Copy Merge Tag:
                        {copiedTag && <span className="text-emerald-500 text-[10px] lowercase">copied {copiedTag}!</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                        {AVAILABLE_MERGE_TAGS.map(t => (
                          <button
                            key={t.tag}
                            type="button"
                            onClick={() => handleCopyTag(t.tag)}
                            title={`Sample: ${t.sample} (Click to copy)`}
                            className="px-2 py-1 bg-white dark:bg-gray-800 hover:bg-amber-500/10 hover:border-amber-500/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Copy size={10} className="text-slate-400" /> {t.tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button & Footer Fields */}
                  <div className="bg-slate-50/70 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.buttonText || ''}
                          onChange={e => handleUpdateCurrentTemplate({ buttonText: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Button Action URL
                        </label>
                        <input
                          type="text"
                          value={selectedTemplate.buttonUrl || ''}
                          onChange={e => handleUpdateCurrentTemplate({ buttonUrl: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Footer Compliance Note
                      </label>
                      <input
                        type="text"
                        value={selectedTemplate.footerNote || ''}
                        onChange={e => handleUpdateCurrentTemplate({ footerNote: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* High-Contrast Professional Dispatch Live Test Email Card */}
                  <div className="p-5 bg-gray-900 border border-amber-500/40 rounded-2xl space-y-4 shadow-xl text-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Send size={15} className="text-amber-400" />
                        Dispatch Live Test Email
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        Target: {smtpSettings.host}:{smtpSettings.port}
                      </span>
                    </div>

                    {/* Progress Banner during Live Dispatch */}
                    {sendingTestEmail && (
                      <div className="p-3.5 bg-amber-950/40 border border-amber-500/50 rounded-xl text-xs text-amber-200 flex items-center gap-3 animate-pulse">
                        <RefreshCw size={16} className="text-amber-400 animate-spin shrink-0" />
                        <div>
                          <div className="font-bold text-white">Dispatched to Outgoing Mail Relay...</div>
                          <div className="text-[11px] text-amber-300 mt-0.5">{testEmailProgressMessage}</div>
                        </div>
                      </div>
                    )}

                    {/* High-Contrast Status Banner */}
                    {testEmailStatus && !sendingTestEmail && (
                      <div className={`p-4 rounded-xl text-xs border shadow-sm ${
                        testEmailStatus.success 
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' 
                          : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            {testEmailStatus.success ? (
                              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">
                                {testEmailStatus.success ? 'Test Email Delivered to Relay' : 'Dispatch Failed'}
                              </div>
                              <div className="mt-1 text-xs opacity-95 leading-relaxed">
                                {testEmailStatus.message}
                              </div>
                            </div>
                          </div>

                          {testEmailStatus.envelope && (
                            <button
                              type="button"
                              onClick={() => setInspectingEnvelope(testEmailStatus.envelope || null)}
                              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700 hover:border-amber-400/50 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                            >
                              <Code size={12} /> Inspect Envelope
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recipient Input with Quick Presets */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <label htmlFor="test-recipient-email" className="font-semibold text-gray-300">
                          Recipient Test Mailbox:
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTestEmailRecipient(smtpSettings.adminNotificationEmail || 'admissions@skylaredasia.ph')}
                            className="hover:text-amber-400 underline cursor-pointer"
                          >
                            Use Admin Email
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setTestEmailRecipient(smtpSettings.fromEmail || 'inquiries@skylaredasia.ph')}
                            className="hover:text-amber-400 underline cursor-pointer"
                          >
                            Use From Email
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          id="test-recipient-email"
                          type="email"
                          value={testEmailRecipient}
                          onChange={e => setTestEmailRecipient(e.target.value)}
                          placeholder="your-email@example.com"
                          className="flex-1 p-2.5 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={sendingTestEmail || !testEmailRecipient}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl text-xs transition-all shrink-0 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-md font-sans"
                        >
                          <Send size={14} /> {sendingTestEmail ? 'Sending...' : 'Send Test'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                      <Sparkles size={13} className="text-amber-400 shrink-0" />
                      <span>The test email compiles live variables (<code className="text-gray-300 font-mono">{"{{student_name}}"}</code>, <code className="text-gray-300 font-mono">{"{{reference_code}}"}</code>) and writes a complete RFC audit entry into the activity log below.</span>
                    </div>
                  </div>

                </div>

                {/* Right Column: Live Email Preview Frame (6 Cols) */}
                <div className="lg:col-span-6 xl:col-span-6 space-y-3">
                  
                  {/* Viewport Control Bar */}
                  <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-gray-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          previewDevice === 'desktop' ? 'bg-white dark:bg-gray-800 text-amber-500 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Monitor size={14} /> Desktop (600px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          previewDevice === 'mobile' ? 'bg-white dark:bg-gray-800 text-amber-500 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Smartphone size={14} /> Mobile (380px)
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('visual')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          previewMode === 'visual' ? 'bg-white dark:bg-gray-800 text-amber-500 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('code')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          previewMode === 'code' ? 'bg-white dark:bg-gray-800 text-amber-500 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Code size={13} /> HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('plain')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          previewMode === 'plain' ? 'bg-white dark:bg-gray-800 text-amber-500 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Plain Text
                      </button>
                    </div>
                  </div>

                  {/* Device Sandbox Container */}
                  <div className="bg-slate-200/70 dark:bg-[#030c1b] p-4 sm:p-6 rounded-3xl border border-slate-300/80 dark:border-slate-800 flex justify-center min-h-[640px] items-start overflow-x-auto shadow-inner">
                    <div
                      className={`transition-all duration-300 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-slate-800 ${
                        previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[580px]'
                      }`}
                    >
                      {/* Fake Client Header */}
                      <div className="bg-slate-100 border-b border-slate-200 p-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="truncate">Subject: {renderMergeTags(selectedTemplate.subject, {
                          reference_code: 'INQ-2026-8492',
                          course_title: 'GWO Basic Safety Training',
                          student_name: 'Engr. Juan Dela Cruz',
                          start_date: '7 Sept 2026',
                          first_name: 'Juan',
                          site_name: 'SKYLAR EDUCATION ASIA'
                        })}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded shrink-0">Live Preview</span>
                      </div>

                      {previewMode === 'visual' ? (
                        <div className="p-0 select-text">
                          <iframe
                            key={`${selectedTemplate.id}-${previewDevice}-${JSON.stringify(selectedTemplate)}`}
                            srcDoc={generateFullEmailHtml(selectedTemplate, {
                              student_name: 'Engr. Juan Dela Cruz',
                              user_name: 'Engr. Juan Dela Cruz',
                              first_name: 'Juan',
                              last_name: 'Dela Cruz',
                              user_email: 'juan.delacruz@example.com',
                              student_email: 'juan.delacruz@example.com',
                              student_phone: '+63 912 345 6789',
                              site_name: 'SKYLAR EDUCATION ASIA',
                              site_url: 'https://skylarasia.com',
                              verification_link: 'https://skylarasia.com/verify-email?token=sec_98421a',
                              reset_password_link: 'https://skylarasia.com/reset-password?token=pwd_77319x',
                              course_name: 'GWO Basic Safety Training (BST)',
                              course_title: 'GWO Basic Safety Training (BST) Standard',
                              reference_code: 'INQ-2026-8492',
                              invoice_number: 'INV-2026-0849',
                              current_date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                              preferred_date: '7 – 10 September 2026',
                              start_date: '7 September 2026',
                              participants: '1 Person',
                              company_name: 'Apex Renewable Energy Inc.',
                              location: 'Angeles City Training Centre, Pampanga'
                            })}
                            title="Email Live Preview"
                            className="w-full h-[620px] border-0"
                          />
                        </div>
                      ) : previewMode === 'code' ? (
                        <div className="p-4 bg-slate-900 text-slate-100 text-xs font-mono h-[620px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap">
                            {generateFullEmailHtml(selectedTemplate, {
                              student_name: 'Engr. Juan Dela Cruz',
                              user_name: 'Engr. Juan Dela Cruz',
                              first_name: 'Juan',
                              course_title: 'GWO Basic Safety Training (BST) Standard',
                              reference_code: 'INQ-2026-8492',
                              preferred_date: '7 – 10 September 2026',
                              start_date: '7 September 2026',
                              participants: '1 Person',
                              company_name: 'Apex Renewable Energy Inc.',
                              location: 'Angeles City Training Centre, Pampanga'
                            })}
                          </pre>
                        </div>
                      ) : (
                        <div className="p-5 bg-white text-slate-800 text-xs font-mono h-[620px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                          {renderMergeTags(selectedTemplate.plainText || selectedTemplate.body, {
                            student_name: 'Engr. Juan Dela Cruz',
                            user_name: 'Engr. Juan Dela Cruz',
                            first_name: 'Juan',
                            site_name: 'SKYLAR EDUCATION ASIA',
                            site_url: 'https://skylarasia.com',
                            course_title: 'GWO Basic Safety Training (BST) Standard',
                            reference_code: 'INQ-2026-8492',
                            current_date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                            preferred_date: '7 – 10 September 2026',
                            start_date: '7 September 2026',
                            location: 'Angeles City Training Centre, Pampanga'
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Complete Email Activity Logs Section */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Activity size={16} className="text-amber-500" />
                      Email Activity Logs &amp; Delivery Tracking
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Audit trail of all transactional and test dispatches sent via configured SMTP.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search recipient or subject..."
                        value={logSearchQuery}
                        onChange={e => setLogSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none w-48"
                      />
                    </div>

                    <select
                      value={logFilterStatus}
                      onChange={e => setLogFilterStatus(e.target.value)}
                      className="p-1.5 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Sent">Sent</option>
                      <option value="Failed">Failed</option>
                      <option value="Pending">Pending</option>
                    </select>

                    {emailLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearLogs}
                        className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                      >
                        Clear Logs
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden text-xs bg-white dark:bg-gray-900/50 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Recipient</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Template / Category</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-300">
                      {emailLogs
                        .filter(l => logFilterStatus === 'All' || l.status === logFilterStatus)
                        .filter(l => !logSearchQuery || l.recipient.toLowerCase().includes(logSearchQuery.toLowerCase()) || l.subject.toLowerCase().includes(logSearchQuery.toLowerCase()))
                        .length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-gray-400">
                            No email delivery logs recorded yet. Dispatch a test email above or send an inquiry to record transactions.
                          </td>
                        </tr>
                      ) : (
                        emailLogs
                          .filter(l => logFilterStatus === 'All' || l.status === logFilterStatus)
                          .filter(l => !logSearchQuery || l.recipient.toLowerCase().includes(logSearchQuery.toLowerCase()) || l.subject.toLowerCase().includes(logSearchQuery.toLowerCase()))
                          .map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                              <td className="p-3 text-gray-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                              </td>
                              <td className="p-3 font-semibold text-slate-800 dark:text-white">
                                {log.recipient}
                              </td>
                              <td className="p-3 truncate max-w-[220px]" title={log.subject}>
                                {log.subject}
                              </td>
                              <td className="p-3 text-slate-500">
                                {log.templateName || log.category || 'General'}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                  log.status === 'Sent'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : (log.status === 'Failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-amber-100 text-amber-700')
                                }`}>
                                  {log.status}
                                </span>
                                {log.errorDetails && (
                                  <div className="text-[10px] text-rose-500 dark:text-rose-400 truncate max-w-[180px]" title={log.errorDetails}>
                                    {log.errorDetails}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {log.envelope && (
                                    <button
                                      type="button"
                                      onClick={() => setInspectingEnvelope(log.envelope || null)}
                                      title="Inspect RFC Envelope & MIME Headers"
                                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-amber-500 rounded-lg text-[11px] font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Code size={11} /> Raw
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={retryingLogId === log.id}
                                    onClick={() => handleRetryLog(log)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <RotateCcw size={11} className={retryingLogId === log.id ? 'animate-spin' : ''} />
                                    {retryingLogId === log.id ? 'Retrying...' : 'Retry'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* CREATE CUSTOM TEMPLATE MODAL */}
          {newTemplateModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-150 dark:border-gray-700 animate-zoom-in">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Mail size={18} className="text-amber-500" />
                    Create New Email Template
                  </h3>
                  <button onClick={() => setNewTemplateModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <X size={18}/>
                  </button>
                </div>
                <form onSubmit={handleCreateNewTemplate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Template Display Name</label>
                    <input 
                      type="text" 
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                      className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm outline-none"
                      placeholder="e.g. VIP Corporate Training Welcome"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={newTemplateCategory}
                      onChange={e => setNewTemplateCategory(e.target.value as EmailTemplateCategory)}
                      className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs sm:text-sm outline-none"
                    >
                      <option value="Custom">Custom</option>
                      <option value="Contact">Contact</option>
                      <option value="Inquiry">Inquiry</option>
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                      <option value="Enrollment">Enrollment</option>
                      <option value="Certification">Certification</option>
                      <option value="Reminder">Reminder</option>
                      <option value="Payment">Payment</option>
                      <option value="Invoice">Invoice</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button type="button" onClick={() => setNewTemplateModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                    <Button type="submit">Create Template</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DIAGNOSTIC RFC ENVELOPE INSPECTOR MODAL */}
          {inspectingEnvelope && (
            <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
              <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-gray-200 animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                  <div className="flex items-center gap-2">
                    <Code className="text-amber-400" size={18} />
                    <h3 className="font-bold text-white text-sm sm:text-base font-mono">
                      SMTP Telemetry & RFC 2822 Envelope
                    </h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setInspectingEnvelope(null)} 
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Host</div>
                      <div className="text-white font-bold truncate">{inspectingEnvelope.host}:{inspectingEnvelope.port}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Security</div>
                      <div className="text-emerald-400 font-bold truncate">{inspectingEnvelope.encryption}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Auth User</div>
                      <div className="text-amber-400 font-bold truncate">{inspectingEnvelope.authSender}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Status</div>
                      <div className="text-emerald-400 font-bold">250 OK Delivered</div>
                    </div>
                  </div>

                  {/* Envelope Meta */}
                  <div className="space-y-1.5 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
                    <div><span className="text-gray-500">Message-ID:</span> <span className="text-amber-300 select-all">{inspectingEnvelope.messageId}</span></div>
                    <div><span className="text-gray-500">From:</span> <span className="text-white select-all">{inspectingEnvelope.from}</span></div>
                    <div><span className="text-gray-500">To:</span> <span className="text-emerald-300 select-all">{inspectingEnvelope.to}</span></div>
                    <div><span className="text-gray-500">Subject:</span> <span className="text-white select-all">{inspectingEnvelope.subject}</span></div>
                    <div><span className="text-gray-500">Timestamp:</span> <span className="text-gray-400">{inspectingEnvelope.date}</span></div>
                  </div>

                  {/* Raw MIME Headers */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Raw RFC Headers:</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (inspectingEnvelope.rawHeaders) {
                            navigator.clipboard.writeText(inspectingEnvelope.rawHeaders);
                            alert("Copied raw headers to clipboard!");
                          }
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        Copy Headers
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 rounded-xl border border-gray-800 text-[11px] text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
                      {inspectingEnvelope.rawHeaders || 'No raw headers recorded.'}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">
                    Compiled Payload: {inspectingEnvelope.rawHtml ? `${inspectingEnvelope.rawHtml.length.toLocaleString()} bytes` : 'N/A'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setInspectingEnvelope(null)} 
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ENTERPRISE EXTENDED CONFIGURATION DOMAIN PANELS */}
          {/* ========================================================= */}

          {/* 1. BRANDING & MULTI-LOGO */}
          {activeTab === 'branding' && (
            <BrandingSettingsPanel
              logos={extendedSettings.logos || []}
              brandColor={extendedSettings.brandColor}
              accentColor={extendedSettings.accentColor}
              borderRadius={extendedSettings.borderRadius}
              sidebarTheme={extendedSettings.sidebarTheme}
              themePreset={extendedSettings.themePreset}
              onChangeLogos={(logos) => updateExtendedSettings({ logos })}
              onChangeTheme={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 2. GENERAL SETTINGS */}
          {(activeTab === 'general' || activeTab === 'system') && (
            <GeneralSettingsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 3. COMPANY INFORMATION */}
          {activeTab === 'company' && (
            <CompanySettingsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 4. CONTACT DIRECTORY */}
          {activeTab === 'contacts' && (
            <ContactSettingsPanel
              contacts={extendedSettings.contactProfiles || []}
              onChangeContacts={(contactProfiles) => updateExtendedSettings({ contactProfiles })}
            />
          )}

          {/* 5. PAYMENT LINKS & BILLING */}
          {(activeTab === 'payment-links' || activeTab === 'payment-billing') && (
            <PaymentBillingPanel
              gateways={extendedSettings.paymentGateways || []}
              onChangeGateways={(paymentGateways) => updateExtendedSettings({ paymentGateways })}
            />
          )}

          {/* 6. SECURITY, AUTHENTICATION & PERMISSIONS */}
          {(activeTab === 'security' || activeTab === 'authentication' || activeTab === 'permissions') && (
            <SecuritySettingsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 7. NOTIFICATIONS MATRIX */}
          {activeTab === 'notifications' && (
            <NotificationSettingsPanel
              rules={extendedSettings.notificationRules || []}
              onChangeRules={(notificationRules) => updateExtendedSettings({ notificationRules })}
            />
          )}

          {/* 8. API & INTEGRATIONS */}
          {activeTab === 'api-integrations' && (
            <ApiStorageCdnPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 9. STORAGE & MEDIA */}
          {activeTab === 'storage' && (
            <ApiStorageCdnPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 10. CDN & EDGE CACHE */}
          {activeTab === 'cdn' && (
            <ApiStorageCdnPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 11. DATABASE & BACKUP */}
          {(activeTab === 'database-backup' || activeTab === 'backup') && (
            <MaintenanceDiagnosticsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 12. SYSTEM MAINTENANCE & HEALTH AUDIT */}
          {activeTab === 'maintenance' && (
            <MaintenanceDiagnosticsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 13. SEO & SOCIAL GRAPH */}
          {activeTab === 'seo' && (
            <SeoTaxPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
              activeMode="seo"
            />
          )}

          {/* 14. LOCALIZATION & FINANCIAL */}
          {activeTab === 'localization' && (
            <GeneralSettingsPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
            />
          )}

          {/* 15. TAX & FINANCIAL */}
          {activeTab === 'tax-financial' && (
            <SeoTaxPanel
              settings={extendedSettings}
              onChange={(updates) => updateExtendedSettings(updates)}
              activeMode="tax"
            />
          )}

          {/* 16. VERSION HISTORY & PORTABLE CONFIGURATION */}
          {activeTab === 'advanced' && (
            <VersionHistoryExportPanel
              onRefreshSettings={refreshAllSettings}
            />
          )}

          {/* 17. USERS & ROLES MATRIX */}
          {activeTab === 'users-roles' && (
            <div className="space-y-6 animate-fade-in text-gray-200">
              <div className="pb-6 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <Users size={20} />
                    </span>
                    Administrator Accounts & Role Access Matrix
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage administrative users, credentials, role assignments, and granular security privileges.
                  </p>
                </div>
                <Button onClick={() => handleOpenUserModal()}>
                  <Plus size={16} className="mr-1.5" /> Add Administrator
                </Button>
              </div>

              {/* User cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminUsers.map(u => (
                  <div key={u.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-white">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                      <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-amber-400 border border-gray-700">
                        {u.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenUserModal(u)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 18. PLATFORM SETTINGS */}
          {activeTab === 'platform' && (
            <div className="space-y-6 animate-fade-in text-gray-200">
              <div className="pb-6 border-b border-gray-800">
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <Sliders size={20} />
                  </span>
                  Platform Operations & Registration Policies
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Control student registration gates, session timeouts, and file limits.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Allow Public Student Registrations</div>
                    <div className="text-[11px] text-gray-400">When enabled, students can create online learning portal accounts.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={extendedSettings.allowNewRegistrations}
                    onChange={(e) => updateExtendedSettings({ allowNewRegistrations: e.target.checked })}
                    className="rounded border-gray-700 text-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Guest Public Course Browsing</div>
                    <div className="text-[11px] text-gray-400">Allow visitors to view course schedules and syllabi without signing in.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={extendedSettings.allowGuestAccess}
                    onChange={(e) => updateExtendedSettings({ allowGuestAccess: e.target.checked })}
                    className="rounded border-gray-700 text-amber-400"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Session Inactivity Timeout (Min)</label>
                    <input
                      type="number"
                      value={extendedSettings.sessionTimeoutMinutes}
                      onChange={(e) => updateExtendedSettings({ sessionTimeoutMinutes: Number(e.target.value) })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pagination Page Size</label>
                    <input
                      type="number"
                      value={extendedSettings.defaultPaginationSize}
                      onChange={(e) => updateExtendedSettings({ defaultPaginationSize: Number(e.target.value) })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Max Upload Limit (MB)</label>
                    <input
                      type="number"
                      value={extendedSettings.fileUploadLimitMb}
                      onChange={(e) => updateExtendedSettings({ fileUploadLimitMb: Number(e.target.value) })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Unified Save / Discard Bar */}
          <SettingsStickyBar
            isDirty={isDirty}
            isSaving={isSavingExtended}
            isSaved={isSaved}
            lastSavedAt={extendedSettings.lastSavedAt}
            lastSavedBy={extendedSettings.lastSavedBy}
            onSave={handleSaveExtendedSettings}
            onCancel={handleCancelExtendedSettings}
            onResetDefaults={handleResetDefaultExtendedSettings}
          />

        </div>
      </div>

      {/* ADMIN USER MODAL */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-150 dark:border-gray-700 animate-zoom-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Key size={18} className="text-accent" />
                {selectedUser ? 'Edit User Credentials' : 'Add Administrative User'}
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none"><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="settings-user-name"
                  name="userName"
                  autoComplete="off"
                  value={userForm.name}
                  onChange={e => setUserForm({...userForm, name: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="settings-user-email"
                  name="userEmail"
                  autoComplete="off"
                  value={userForm.email}
                  onChange={e => setUserForm({...userForm, email: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. john@skylar.edu"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Access Role</label>
                <select
                  id="settings-user-role"
                  name="userRole"
                  autoComplete="off"
                  value={userForm.role}
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-semibold"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Staff">Staff Member</option>
                  <option value="Instructor">Instructor / Trainer</option>
                  <option value="Compliance Officer">Compliance Officer</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button type="button" onClick={() => setUserModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <Button type="submit">Save User</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROLE PERMISSIONS MODAL */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-150 dark:border-gray-700 animate-zoom-in">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                {selectedRole ? 'Edit Access Role Scope' : 'Add Custom Access Role'}
              </h3>
              <button onClick={() => setRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none"><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role Name</label>
                <input 
                  type="text" 
                  id="settings-role-name"
                  name="roleName"
                  autoComplete="off"
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. Compliance Manager"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <input 
                  type="text" 
                  id="settings-role-desc"
                  name="roleDescription"
                  autoComplete="off"
                  value={roleForm.description}
                  onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Summarize the core duties of this role..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Authorization Privileges (Permissions)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { id: 'view_courses', label: 'View Courses' },
                    { id: 'manage_courses', label: 'Edit & Add Courses' },
                    { id: 'manage_students', label: 'Manage Students' },
                    { id: 'manage_enrollments', label: 'Approve Enrollments' },
                    { id: 'manage_finance', label: 'View Billing & Finance' },
                    { id: 'manage_settings', label: 'System Settings Control' },
                    { id: 'view_logs', label: 'Read Audit Logs' },
                    { id: 'manage_corporate', label: 'Corporate Accounts' }
                  ].map(perm => (
                    <label key={perm.id} className="flex items-center gap-2.5 p-2.5 border dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900/35 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                      <input 
                        type="checkbox" 
                        id={`settings-perm-${perm.id}`}
                        name="permissions"
                        autoComplete="off"
                        checked={roleForm.permissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button type="button" onClick={() => setRoleModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <Button type="submit">Save Role</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

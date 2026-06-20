import React, { useState, useEffect } from 'react';
import { 
  Save, Lock, Globe, Users, Shield, Layout, Settings, 
  ToggleLeft, ToggleRight, Plus, Trash2, Edit2, Check, Calendar, Activity,
  Database, UploadCloud, Download, RefreshCw, X, Palette, Image, ShieldAlert, Key
} from 'lucide-react';
import { Button } from '../../components/Button';
import { 
  getSettings, saveSettings, getAdminUsers, saveAdminUser, deleteAdminUser,
  getRoles, getModules, toggleModule, getAuditLogs, getCourses, getStudents
} from '../../services/storageService';
import { AdminUser, Role } from '../../types';

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'enrollment' | 'appearance' | 'roles' | 'logs' | 'users' | 'backup'>('system');
  const [settings, setSettings] = useState(getSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getAdminUsers());
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [modules, setModules] = useState(getModules());
  const [auditLogs, setAuditLogs] = useState(getAuditLogs());

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'light' | 'dark' | 'favicon' | 'loading') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (< 2MB to keep localStorage clean)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSettings(prev => {
          const next = { ...prev };
          if (type === 'light') next.lightLogoUrl = base64;
          else if (type === 'dark') next.darkLogoUrl = base64;
          else if (type === 'loading') next.loadingLogoUrl = base64;
          else next.faviconUrl = base64;
          saveSettings(next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearBranding = () => {
    if (window.confirm("Are you sure you want to clear all custom logos and restore default branding?")) {
      const resetSettings = {
        ...settings,
        lightLogoUrl: '',
        darkLogoUrl: '',
        loadingLogoUrl: '',
        faviconUrl: '',
        brandColor: '#041024',
        themePreset: 'navy' as const
      };
      setSettings(resetSettings);
      saveSettings(resetSettings);
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

  const tabs = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'enrollment', label: 'Enrollment', icon: Calendar },
    { id: 'appearance', label: 'Appearance', icon: Layout },
    { id: 'roles', label: 'Roles & Access', icon: Shield },
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Admin Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Configure global parameters, custom branding design, and system access levels.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[650px] flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-gray-800 text-primary dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-accent' : 'text-gray-400'} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-white dark:bg-gray-800">
          
          {/* SYSTEM TAB */}
          {activeTab === 'system' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">General Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Basic identity details about your RTO training institute.</p>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Institute Name</label>
                      <input 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.instituteName} 
                        onChange={e => setSettings({...settings, instituteName: e.target.value})} 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">RTO ID Code</label>
                      <input 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.rtoId} 
                        onChange={e => setSettings({...settings, rtoId: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">ABN / Corporate Tax ID</label>
                      <input 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.taxId || ''} 
                        onChange={e => setSettings({...settings, taxId: e.target.value})} 
                        placeholder="e.g. ABN 84 920 184 721"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Support Helpline Email</label>
                      <input 
                        type="email"
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
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.contactPhone} 
                        onChange={e => setSettings({...settings, contactPhone: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Operating Hours</label>
                      <input 
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
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.supportContactName || ''} 
                        onChange={e => setSettings({...settings, supportContactName: e.target.value})} 
                        placeholder="e.g. Administrator Team"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Support Working Schedule</label>
                      <input 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                        value={settings.supportHours || ''} 
                        onChange={e => setSettings({...settings, supportHours: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Physical Address</label>
                    <input 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all dark:text-white" 
                      value={settings.address} 
                      onChange={e => setSettings({...settings, address: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Banner Site Announcement</label>
                    <textarea 
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
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                      value={settings.enrollmentDeadline || ''} 
                      onChange={e => setSettings({...settings, enrollmentDeadline: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Tuition Currency</label>
                      <select
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
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                        value={settings.classSizeLimit || 20} 
                        onChange={e => setSettings({...settings, classSizeLimit: parseInt(e.target.value) || 20})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Passing Assessment %</label>
                      <input 
                        type="number"
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
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Branding & Theme Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Customize logos for light/dark displays, set your primary brand color, and edit document favicons.</p>
                
                <div className="space-y-6">
                  {/* Mode & Theme Presets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                      <div>
                        <h4 className="font-bold text-gray-700 dark:text-white">Default Dark Mode</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Initialize website in dark mode by default.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSettings({...settings, defaultDarkMode: !settings.defaultDarkMode})}
                        className={`${settings.defaultDarkMode ? 'text-blue-500' : 'text-gray-300'} transition-colors focus:outline-none`}
                      >
                        {settings.defaultDarkMode ? <ToggleRight size={44} className="fill-current"/> : <ToggleLeft size={44}/>}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Preset Theme Template</label>
                      <select
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white font-semibold"
                        value={settings.themePreset || 'navy'}
                        onChange={e => {
                          const val = e.target.value as any;
                          let color = '#041024';
                          if (val === 'dark') color = '#111827';
                          if (val === 'emerald') color = '#065f46';
                          if (val === 'crimson') color = '#991b1b';
                          setSettings({ ...settings, themePreset: val, brandColor: color });
                        }}
                      >
                        <option value="navy">Sleek Navy Blue (Brand Default)</option>
                        <option value="dark">Classic Solid Dark</option>
                        <option value="emerald">Emerald Forest Safety</option>
                        <option value="crimson">Crimson Red Fire Rescue</option>
                      </select>
                    </div>
                  </div>

                  {/* Brand Color Picker */}
                  <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    <h4 className="font-bold text-gray-700 dark:text-white flex items-center gap-2">
                      <Palette size={18} className="text-primary dark:text-blue-400" />
                      Dynamic Brand Customization Color
                    </h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <input 
                        type="color" 
                        value={settings.brandColor || '#041024'}
                        onChange={e => setSettings({...settings, brandColor: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                      />
                      <input 
                        type="text" 
                        value={settings.brandColor || '#041024'}
                        onChange={e => setSettings({...settings, brandColor: e.target.value})}
                        placeholder="#041024"
                        className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-white font-mono text-sm max-w-xs focus:ring-2 focus:ring-primary uppercase animate-fade-in"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        This color dynamically updates navigation menus, action buttons, links, and styling accents across the application.
                      </div>
                    </div>
                  </div>

                  {/* Logo Uploaders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Light Mode Logo */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900/20 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1">
                          <Image size={16} /> Light Mode Logo
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Visible on light header backgrounds.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center p-2 border border-dashed border-gray-300">
                          {settings.lightLogoUrl ? (
                            <img src={settings.lightLogoUrl} alt="Light logo preview" className="max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-gray-400">Default Logo Active</span>
                          )}
                        </div>
                        <label className="block text-center cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 hover:dark:bg-gray-600 py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold dark:text-white">
                          Change Logo File
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'light')} />
                        </label>
                      </div>
                    </div>

                    {/* Dark Mode Logo */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900/20 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1">
                          <Image size={16} /> Dark Mode Logo
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Visible on dark header backgrounds / footers.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="h-20 bg-secondary rounded flex items-center justify-center p-2 border border-dashed border-gray-600">
                          {settings.darkLogoUrl ? (
                            <img src={settings.darkLogoUrl} alt="Dark logo preview" className="max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-gray-400">Default Logo Active</span>
                          )}
                        </div>
                        <label className="block text-center cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 hover:dark:bg-gray-600 py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold dark:text-white">
                          Change Logo File
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'dark')} />
                        </label>
                      </div>
                    </div>

                    {/* Loading Screen Logo */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900/20 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1">
                          <Image size={16} /> Loading Screen Logo
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Displayed on initial connection/loading page.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="h-20 bg-[#192436] rounded flex items-center justify-center p-2 border border-dashed border-gray-600">
                          {settings.loadingLogoUrl ? (
                            <img src={settings.loadingLogoUrl} alt="Loading logo preview" className="max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-gray-400">Default Logo Active</span>
                          )}
                        </div>
                        <label className="block text-center cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 hover:dark:bg-gray-600 py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold dark:text-white">
                          Change Logo File
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'loading')} />
                        </label>
                      </div>
                    </div>

                    {/* Favicon Logo */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900/20 flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1">
                          <Image size={16} /> Browser Favicon
                        </h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Short-cut icon visible on browser tabs.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center p-2 border border-dashed border-gray-300">
                          {settings.faviconUrl ? (
                            <img src={settings.faviconUrl} alt="Favicon preview" className="h-10 w-10 object-contain" />
                          ) : (
                            <span className="text-[10px] text-gray-400">Default Favicon Active</span>
                          )}
                        </div>
                        <label className="block text-center cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 hover:dark:bg-gray-600 py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold dark:text-white">
                          Change Favicon File
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'favicon')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Reset branding button */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={handleClearBranding}
                      className="text-xs font-bold text-red-500 dark:text-red-400 hover:underline flex items-center gap-1 focus:outline-none"
                    >
                      <RefreshCw size={12} /> Clear Custom Branding and Reset defaults
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <Button type="submit" className="w-40 shadow-lg flex items-center justify-center gap-2">
                  {isSaved ? <span className="flex items-center gap-1.5"><Check size={16}/> Saved</span> : <span className="flex items-center gap-1.5"><Save size={16}/> Save Appearance</span>}
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
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Resets the entire local data storage back to original system mock data. This wipes all modifications.</p>
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

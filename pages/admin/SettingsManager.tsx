
import React, { useState } from 'react';
import { 
  Save, Lock, Globe, Users, Shield, Layout, Settings, 
  ToggleLeft, ToggleRight, Plus, Trash2, Edit2, Check, Calendar, Activity,
  Database, UploadCloud, Download
} from 'lucide-react';
import { Button } from '../../components/Button';
import { 
  getSettings, saveSettings, getAdminUsers, saveAdminUser, deleteAdminUser,
  getRoles, getModules, toggleModule, getAuditLogs
} from '../../services/storageService';
import { AdminUser, Role } from '../../types';

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'enrollment' | 'appearance' | 'roles' | 'logs' | 'users' | 'backup'>('system');
  const [settings, setSettings] = useState(getSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getAdminUsers());
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [modules, setModules] = useState(getModules());
  const auditLogs = getAuditLogs();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleModule = (id: string) => {
    toggleModule(id);
    setModules(getModules());
  };

  const handleDeleteUser = (id: string) => {
    if(window.confirm("Remove this admin user?")) {
        deleteAdminUser(id);
        setAdminUsers(getAdminUsers());
    }
  };

  const tabs = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'enrollment', label: 'Enrollment', icon: Calendar },
    { id: 'appearance', label: 'Appearance', icon: Layout },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
       <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Admin Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Configure global parameters, enrollment periods, and access controls.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
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
                    <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl animate-fade-in">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">General Information</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Basic details about your institute.</p>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Institute Name</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm dark:text-white" 
                                        value={settings.instituteName} 
                                        onChange={e => setSettings({...settings, instituteName: e.target.value})} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">RTO ID</label>
                                        <input 
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm dark:text-white" 
                                            value={settings.rtoId} 
                                            onChange={e => setSettings({...settings, rtoId: e.target.value})} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
                                        <input 
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm dark:text-white" 
                                            value={settings.contactPhone} 
                                            onChange={e => setSettings({...settings, contactPhone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm dark:text-white" 
                                        value={settings.address} 
                                        onChange={e => setSettings({...settings, address: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <Button type="submit" className="w-32 shadow-lg">
                                {isSaved ? <span className="flex items-center gap-2"><Check size={18}/> Saved</span> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* ENROLLMENT TAB */}
                {activeTab === 'enrollment' && (
                    <form onSubmit={handleSaveSettings} className="space-y-8 max-w-2xl animate-fade-in">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Enrollment Configuration</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage school years and application periods.</p>
                            
                            <div className="space-y-6">
                                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                                    <div>
                                        <h4 className="font-bold text-gray-700 dark:text-white">Accepting Applications</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Toggle public enrollment forms on/off.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setSettings({...settings, enrollmentOpen: !settings.enrollmentOpen})}
                                        className={`${settings.enrollmentOpen ? 'text-green-500' : 'text-gray-300'} transition-colors`}
                                    >
                                        {settings.enrollmentOpen ? <ToggleRight size={40} className="fill-current"/> : <ToggleLeft size={40}/>}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Academic Term</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                                        value={settings.currentTerm || ''} 
                                        onChange={e => setSettings({...settings, currentTerm: e.target.value})}
                                        placeholder="e.g. Semester 1, 2025"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enrollment Deadline</label>
                                    <input 
                                        type="date"
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" 
                                        value={settings.enrollmentDeadline || ''} 
                                        onChange={e => setSettings({...settings, enrollmentDeadline: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <Button type="submit" className="w-32 shadow-lg">Save Config</Button>
                        </div>
                    </form>
                )}

                {/* AUDIT LOGS TAB */}
                {activeTab === 'logs' && (
                    <div className="animate-fade-in space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Audit Logs</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Track system activity and user actions.</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Module</th>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {auditLogs.length === 0 ? (
                                        <tr><td colSpan={5} className="p-6 text-center text-gray-500">No activity recorded.</td></tr>
                                    ) : (
                                        auditLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                                                <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{log.adminName}</td>
                                                <td className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{log.module}</td>
                                                <td className="px-6 py-4 font-medium text-primary dark:text-blue-400">{log.action}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 truncate max-w-xs" title={log.details}>{log.details}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                    <div className="space-y-8 animate-fade-in max-w-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Branding & Theme</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Customize the look and feel of the portal.</p>
                            
                            <div className="space-y-6">
                                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                                    <div>
                                        <h4 className="font-bold text-gray-700 dark:text-white">Dark Mode Default</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Enable dark mode for all new users by default.</p>
                                    </div>
                                    <button className="text-gray-400"><ToggleLeft size={40}/></button>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Brand Color (Primary)</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary shadow-sm border border-gray-200 dark:border-gray-700"></div>
                                        <input type="text" value="#041024" disabled className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-300 font-mono text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLES TAB */}
                {activeTab === 'roles' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Roles & Permissions</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage access levels for your team.</p>
                            </div>
                            <Button size="sm"><Plus size={16} className="mr-2"/> Add Role</Button>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Role Name</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Users</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {roles.map(role => (
                                        <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{role.name}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{role.description}</td>
                                            <td className="px-6 py-4"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold">{role.usersCount} Members</span></td>
                                            <td className="px-6 py-4 text-right text-gray-400">
                                                <button className="hover:text-primary mr-3"><Edit2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
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
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">User Management</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Administrators and Staff accounts.</p>
                            </div>
                            <Button size="sm"><Plus size={16} className="mr-2"/> Invite User</Button>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Active</th>
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
                                            <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold">{user.role}</span></td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Active</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{user.lastActive}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16}/></button>
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
                    <div className="animate-fade-in space-y-8 max-w-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Database Backup & Restore</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Export all website settings, courses, student records, and content, or restore from a backup file.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Export Section */}
                            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-4">
                                <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Download size={18} className="text-primary dark:text-blue-400" /> Export Database
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Download a full backup of all current site data as a single JSON file. You can use this to migrate data between live and local environments.</p>
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
                                    className="w-full"
                                >
                                    Download Backup (.json)
                                </Button>
                            </div>
                            
                            {/* Import Section */}
                            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-4">
                                <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <UploadCloud size={18} className="text-green-600 dark:text-green-400" /> Import Database
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a previously exported JSON backup file. <span className="text-red-500 font-bold">Warning:</span> This will overwrite all existing local database records.</p>
                                <label className="cursor-pointer block text-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm font-semibold dark:text-white transition-all">
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
                                                        alert(`Database restored successfully! ${importedCount} keys imported. The page will now reload.`);
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
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

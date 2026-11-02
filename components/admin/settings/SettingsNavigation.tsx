import React from 'react';
import { 
  Palette, Sliders, Building2, PhoneCall, Link2, CreditCard,
  Mail, FileText, Bell, LayoutGrid, Users, ShieldCheck,
  KeyRound, ShieldAlert, Cpu, HardDrive, Zap, Database,
  Search, Globe2, Percent, Wrench, Activity, History, ChevronRight
} from 'lucide-react';
import { SettingsTabId } from '../../../types';

export interface NavItem {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

export const SETTINGS_NAV_ITEMS: NavItem[] = [
  // Core Identity & Appearance
  { id: 'branding', label: 'Branding & Logo', icon: Palette, category: 'Identity & Brand', badge: '9 Assets', description: 'Logos, favicon, dimensions & previews' },
  { id: 'general', label: 'General Settings', icon: Sliders, category: 'Identity & Brand', description: 'Platform identity, timezone & units' },
  { id: 'company', label: 'Company Information', icon: Building2, category: 'Identity & Brand', description: 'Legal registry, tax ID & corporate profile' },
  { id: 'contacts', label: 'Contact Information', icon: PhoneCall, category: 'Identity & Brand', badge: '6 Depts', description: 'Department contacts & notification routing' },

  // Finance & Payments
  { id: 'payment-links', label: 'Payment Links & QR', icon: Link2, category: 'Payments & Finance', description: 'Direct customer payment links & QR triggers' },
  { id: 'payment-billing', label: 'Payment Gateways', icon: CreditCard, category: 'Payments & Finance', badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-400', description: 'GCash, Maya, Stripe, Bank Wire & Sandbox' },
  { id: 'tax-financial', label: 'Tax & Financial Rules', icon: Percent, category: 'Payments & Finance', description: 'VAT, withholding tax, prefixes & terms' },

  // Communications & Alerts
  { id: 'smtp', label: 'Email / SMTP Setup', icon: Mail, category: 'Communications', badge: 'Verified', badgeColor: 'bg-emerald-500/20 text-emerald-400', description: 'SMTP relay host, credentials & test connection' },
  { id: 'email-templates', label: 'Email Templates', icon: FileText, category: 'Communications', description: 'Transactional HTML templates & merge tags' },
  { id: 'notifications', label: 'Notification Settings', icon: Bell, category: 'Communications', description: 'Event matrix: Email, In-App, SMS, Push' },

  // Platform, Users & Security
  { id: 'platform', label: 'Platform & Operations', icon: LayoutGrid, category: 'Security & Access', description: 'Maintenance mode, guest access & upload limits' },
  { id: 'users-roles', label: 'Users & Roles Matrix', icon: Users, category: 'Security & Access', description: 'Admin accounts & granular permissions' },
  { id: 'security', label: 'Security Center', icon: ShieldCheck, category: 'Security & Access', badge: '94% Score', badgeColor: 'bg-emerald-500/20 text-emerald-400', description: '2FA, brute force protection & IP filtering' },
  { id: 'authentication', label: 'Authentication Policies', icon: KeyRound, category: 'Security & Access', description: 'Session timeouts & password policies' },

  // Infrastructure & Media
  { id: 'api-integrations', label: 'API & Integrations', icon: Cpu, category: 'Infrastructure', badge: 'REST / Hooks', description: 'API credentials, webhooks & developer tokens' },
  { id: 'storage', label: 'Storage & Media', icon: HardDrive, category: 'Infrastructure', description: 'Storage quota, WebP conversion & bucket rules' },
  { id: 'cdn', label: 'CDN & Edge Cache', icon: Zap, category: 'Infrastructure', badge: 'Cloudflare', badgeColor: 'bg-blue-500/20 text-blue-400', description: 'Pull zone, edge cache TTL & instant cache purge' },
  { id: 'database-backup', label: 'Database & Backup', icon: Database, category: 'Infrastructure', description: 'Automated backups, encryption & snapshot restore' },

  // Optimization & Governance
  { id: 'seo', label: 'SEO & Social Graph', icon: Search, category: 'Optimization & Health', description: 'Meta tags, sitemap, robots.txt & Google preview' },
  { id: 'localization', label: 'Localization & Formats', icon: Globe2, category: 'Optimization & Health', description: 'Currencies, multilingual standards & dates' },
  { id: 'maintenance', label: 'System Maintenance', icon: Wrench, category: 'Optimization & Health', badge: 'Diagnostics', badgeColor: 'bg-amber-500/20 text-amber-400', description: 'System health dashboard & cache clearers' },
  { id: 'audit-logs', label: 'Activity & Audit Logs', icon: Activity, category: 'Optimization & Health', description: 'Immutable admin audit trail & change history' },
  { id: 'advanced', label: 'Version History & Config', icon: History, category: 'Optimization & Health', description: 'JSON backup snapshot, restore & export/import' }
];

interface SettingsNavigationProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange
}) => {
  const filteredItems = SETTINGS_NAV_ITEMS.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const categories = Array.from(new Set(filteredItems.map(i => i.category)));

  return (
    <div className="w-full flex flex-col h-full bg-gray-900/60 border-r border-gray-800 text-gray-200 select-none">
      {/* Search Bar Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all settings (e.g. SMTP, GCash, SEO)..."
            className="w-full pl-9 pr-8 py-2.5 bg-gray-800/90 border border-gray-700/80 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-inner"
          />
          <Search size={15} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-white px-1"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400 px-1">
          <span>{filteredItems.length} modules available</span>
          <span className="font-mono text-accent text-[10px]">Enterprise v2.8</span>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Selector */}
      <div className="md:hidden p-4 border-b border-gray-800 bg-gray-900">
        <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
          Select Configuration Module
        </label>
        <select
          value={activeTab}
          onChange={(e) => onSelectTab(e.target.value as SettingsTabId)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-medium text-sm focus:ring-2 focus:ring-accent"
        >
          {SETTINGS_NAV_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.category}: {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation List for Desktop */}
      <div className="hidden md:block flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {categories.map((category) => {
          const items = filteredItems.filter(i => i.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                {category}
              </div>
              {items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-accent/15 border-l-4 border-accent text-white font-semibold shadow-sm'
                        : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-md transition-colors ${
                          isActive
                            ? 'bg-accent text-gray-950 font-bold shadow'
                            : 'bg-gray-800 text-gray-400 group-hover:text-accent group-hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-medium tracking-tight truncate leading-tight">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-[10px] text-gray-400 truncate mt-0.5 leading-tight group-hover:text-gray-300">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            item.badgeColor || 'bg-gray-800 text-gray-300 border border-gray-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        size={13}
                        className={`transition-transform duration-150 ${
                          isActive
                            ? 'text-accent translate-x-0.5'
                            : 'text-gray-600 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

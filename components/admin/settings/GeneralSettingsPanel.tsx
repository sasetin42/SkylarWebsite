import React from 'react';
import { Sliders, Building2, Globe, Clock, Hash, Check, Calendar, HelpCircle } from 'lucide-react';
import { ExtendedSystemSettings } from '../../../types';

interface GeneralSettingsPanelProps {
  settings: ExtendedSystemSettings;
  onChange: (updates: Partial<ExtendedSystemSettings>) => void;
}

export const GeneralSettingsPanel: React.FC<GeneralSettingsPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Sliders size={20} />
          </span>
          General System Settings & Global Formats
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Configure application naming, operational identity, timezone, time formats, and system-wide broadcast banners.
        </p>
      </div>

      {/* Basic Platform Identity */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Building2 size={16} className="text-amber-400" />
          Application Identity
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Application Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={settings.applicationName}
              onChange={(e) => onChange({ applicationName: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="e.g. Skylar Education Asia Platform"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={settings.websiteUrl}
              onChange={(e) => onChange({ websiteUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent font-mono"
              placeholder="https://skylareducation.asia"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Application Description / Mission Statement
          </label>
          <textarea
            rows={3}
            value={settings.applicationDescription}
            onChange={(e) => onChange({ applicationDescription: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent leading-relaxed"
            placeholder="Brief overview describing the portal purpose..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Global Site Announcement Banner
          </label>
          <input
            type="text"
            value={settings.siteAnnouncement || ''}
            onChange={(e) => onChange({ siteAnnouncement: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-amber-300 placeholder-gray-500 focus:ring-2 focus:ring-amber-400"
            placeholder="Enter active alerts, updates, or maintenance warnings to display across public headers..."
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Leave blank to hide the top notice bar. When filled, displays prominently on all user pages.
          </p>
        </div>
      </div>

      {/* Regional & Format Standards */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Globe size={16} className="text-amber-400" />
          Localization & Numerical Standards
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Default Language
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => onChange({ defaultLanguage: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value="English (US / Global)">English (US / Global)</option>
              <option value="English (Australia)">English (Australia)</option>
              <option value="Filipino / Tagalog">Filipino / Tagalog</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Chinese (Simplified)">Chinese (简体中文)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Operating Currency
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => onChange({ defaultCurrency: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400 font-medium"
            >
              <option value="PHP (₱)">PHP (₱) - Philippine Peso</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="AUD ($)">AUD ($) - Australian Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="SGD ($)">SGD ($) - Singapore Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400 font-mono text-xs"
            >
              <option value="Asia/Manila (GMT+8)">Asia/Manila (GMT+8)</option>
              <option value="Australia/Sydney (AEST / GMT+10)">Australia/Sydney (AEST / GMT+10)</option>
              <option value="Asia/Singapore (GMT+8)">Asia/Singapore (GMT+8)</option>
              <option value="UTC (GMT+0)">UTC (GMT+0)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Date Display Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => onChange({ dateFormat: e.target.value })}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
            >
              <option value="YYYY-MM-DD">2026-09-15 (YYYY-MM-DD)</option>
              <option value="DD/MM/YYYY">15/09/2026 (DD/MM/YYYY)</option>
              <option value="MM/DD/YYYY">09/15/2026 (MM/DD/YYYY)</option>
              <option value="D MMMM YYYY">15 September 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Time Format
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e) => onChange({ timeFormat: e.target.value })}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value="12-hour (AM/PM)">12-Hour (e.g. 03:45 PM)</option>
              <option value="24-hour">24-Hour (e.g. 15:45)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              First Day of Week
            </label>
            <select
              value={settings.firstDayOfWeek}
              onChange={(e) => onChange({ firstDayOfWeek: e.target.value as any })}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value="Monday">Monday (ISO 8601)</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Number Separator
            </label>
            <select
              value={settings.numberFormat}
              onChange={(e) => onChange({ numberFormat: e.target.value as any })}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
            >
              <option value="1,234.56">1,234.56 (Standard)</option>
              <option value="1.234,56">1.234,56 (European)</option>
              <option value="1 234,56">1 234,56 (SI Space)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

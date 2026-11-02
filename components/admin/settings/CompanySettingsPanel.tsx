import React from 'react';
import { Building2, MapPin, Mail, Phone, Clock, FileText, Share2, ShieldCheck } from 'lucide-react';
import { ExtendedSystemSettings } from '../../../types';

interface CompanySettingsPanelProps {
  settings: ExtendedSystemSettings;
  onChange: (updates: Partial<ExtendedSystemSettings>) => void;
}

export const CompanySettingsPanel: React.FC<CompanySettingsPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Building2 size={20} />
          </span>
          Company Information & Legal Profile
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Corporate entity identification, business registration, tax accreditation, and physical headquarters data that automatically populates official invoices, receipts, and certificates.
        </p>
      </div>

      {/* Corporate Registration */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-400" />
          Entity & Tax Registration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Legal Registered Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={settings.companyLegalName}
              onChange={(e) => onChange({ companyLegalName: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. Skylar Education Asia Training Corp."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Trading / Brand Name
            </label>
            <input
              type="text"
              value={settings.companyTradingName}
              onChange={(e) => onChange({ companyTradingName: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. Skylar Education Asia"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Registration Number (SEC / ASIC / ABN)
            </label>
            <input
              type="text"
              value={settings.registrationNumber}
              onChange={(e) => onChange({ registrationNumber: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. SEC-CS202304921 / ABN 84 920 184 721"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Tax Identification Number (TIN)
            </label>
            <input
              type="text"
              value={settings.taxIdentificationNumber}
              onChange={(e) => onChange({ taxIdentificationNumber: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. TIN: 009-847-192-00000"
            />
          </div>
        </div>
      </div>

      {/* Headquarters Location & Contacts */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <MapPin size={16} className="text-amber-400" />
          Physical Training Facility Address
        </h4>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Street Address Line
          </label>
          <input
            type="text"
            value={settings.addressLine}
            onChange={(e) => onChange({ addressLine: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
            placeholder="Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">City</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="Angeles City"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Province / State</label>
            <input
              type="text"
              value={settings.provinceState}
              onChange={(e) => onChange({ provinceState: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="Pampanga"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Country</label>
            <input
              type="text"
              value={settings.country}
              onChange={(e) => onChange({ country: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="Philippines"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">ZIP / Postal Code</label>
            <input
              type="text"
              value={settings.zipCode}
              onChange={(e) => onChange({ zipCode: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:ring-2 focus:ring-amber-400"
              placeholder="2009"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Landline Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="+63 45 123 4567"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Mobile Hotline
            </label>
            <input
              type="text"
              value={settings.mobilePhone}
              onChange={(e) => onChange({ mobilePhone: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="+63 968 382 4294"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Primary Corporate Email
            </label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => onChange({ companyEmail: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
              placeholder="info@skylareducation.asia"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Standard Business / Operation Hours
          </label>
          <input
            type="text"
            value={settings.businessHours}
            onChange={(e) => onChange({ businessHours: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
            placeholder="Mon - Fri: 8:00 AM – 5:00 PM (PST)"
          />
        </div>
      </div>

      {/* Social Links & Policies */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Share2 size={16} className="text-amber-400" />
          Social Profiles & Compliance Links
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Facebook Page</label>
            <input
              type="url"
              value={settings.facebookUrl || ''}
              onChange={(e) => onChange({ facebookUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">LinkedIn Page</label>
            <input
              type="url"
              value={settings.linkedinUrl || ''}
              onChange={(e) => onChange({ linkedinUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Instagram Page</label>
            <input
              type="url"
              value={settings.instagramUrl || ''}
              onChange={(e) => onChange({ instagramUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Terms & Conditions URL</label>
            <input
              type="text"
              value={settings.termsAndConditionsUrl || ''}
              onChange={(e) => onChange({ termsAndConditionsUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
              placeholder="/terms"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Privacy Policy URL</label>
            <input
              type="text"
              value={settings.privacyPolicyUrl || ''}
              onChange={(e) => onChange({ privacyPolicyUrl: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 font-mono"
              placeholder="/privacy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

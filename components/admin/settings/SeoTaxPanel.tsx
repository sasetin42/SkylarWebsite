import React, { useState } from 'react';
import { 
  Search, Globe, Percent, Receipt, FileText, CheckCircle, 
  ExternalLink, Eye, AlertCircle, Calendar, Hash 
} from 'lucide-react';
import { ExtendedSystemSettings, TaxRateRule } from '../../../types';

interface SeoTaxPanelProps {
  settings: ExtendedSystemSettings;
  onChange: (updates: Partial<ExtendedSystemSettings>) => void;
  activeMode: 'seo' | 'tax';
}

export const SeoTaxPanel: React.FC<SeoTaxPanelProps> = ({
  settings,
  onChange,
  activeMode
}) => {
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);

  const handleUpdateTaxRate = (id: string, updates: Partial<TaxRateRule>) => {
    const next = (settings.taxRates || []).map(t => (t.id === id ? { ...t, ...updates } : t));
    onChange({ taxRates: next });
  };

  const handleAddTaxRate = () => {
    const newRate: TaxRateRule = {
      id: `tax-${Date.now().toString(36)}`,
      name: 'Custom Service Tax',
      ratePercent: 5.0,
      type: 'Standard',
      isDefault: false,
      description: 'Applicable standard local assessment tax.'
    };
    onChange({ taxRates: [...(settings.taxRates || []), newRate] });
  };

  const handleDeleteTaxRate = (id: string) => {
    const next = (settings.taxRates || []).filter(t => t.id !== id);
    onChange({ taxRates: next });
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      {/* 1. SEO & METADATA CONFIGURATION */}
      {activeMode === 'seo' && (
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-800">
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Search size={20} />
              </span>
              Global SEO Optimization, OpenGraph & Search Previews
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Fine-tune meta tags, Google snippet presentation, OpenGraph social cards, sitemap URLs, and robots.txt crawling directives.
            </p>
          </div>

          {/* LIVE GOOGLE SEARCH RESULT SNIPPET PREVIEW */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Eye size={15} className="text-amber-400" />
                Live Google Search Snippet Simulator
              </span>
              <span className="text-[10px] text-gray-400 font-mono">SERP Preview</span>
            </div>

            <div className="p-4 bg-white text-gray-900 rounded-lg shadow font-sans max-w-2xl border border-gray-200">
              <div className="text-xs text-[#202124] truncate flex items-center gap-1.5">
                <span className="text-gray-500">{settings.canonicalUrl || 'https://skylareducation.asia'}</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-500">courses</span>
              </div>
              <h4 className="text-base text-[#1a0dab] hover:underline font-normal cursor-pointer line-clamp-1 leading-snug">
                {settings.siteTitle || 'Skylar Education Asia | Accredited GWO Wind Safety Training'}
              </h4>
              <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
                {settings.metaDescription || 'Leading provider of Global Wind Organisation (GWO) certified safety training courses in Angeles City, Pampanga, Philippines.'}
              </p>
            </div>
          </div>

          {/* Core Meta Inputs */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Global Title Tag ({settings.siteTitle.length} chars)
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => onChange({ siteTitle: e.target.value })}
                className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-amber-400"
                placeholder="Skylar Education Asia | ..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Meta Description ({settings.metaDescription.length} chars - Recommended 150-160)
              </label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => onChange({ metaDescription: e.target.value })}
                className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 leading-relaxed"
                placeholder="Brief summary shown on Google search..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Target Keywords</label>
                <input
                  type="text"
                  value={settings.keywords}
                  onChange={(e) => onChange({ keywords: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400"
                  placeholder="GWO training, basic safety training..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Canonical URL</label>
                <input
                  type="url"
                  value={settings.canonicalUrl}
                  onChange={(e) => onChange({ canonicalUrl: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                  placeholder="https://skylareducation.asia"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Robots.txt Directives</label>
              <textarea
                rows={4}
                value={settings.robotsTxt}
                onChange={(e) => onChange({ robotsTxt: e.target.value })}
                className="w-full p-2.5 bg-gray-950 border border-gray-700 rounded-lg text-xs text-amber-300 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. TAX & FINANCIAL RULES */}
      {activeMode === 'tax' && (
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-800">
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Percent size={20} />
              </span>
              Taxation, Document Prefixes & Invoicing Rules
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Configure VAT rates, Withholding Tax, official document sequential prefixes, and corporate payment term rules.
            </p>
          </div>

          {/* Prefixes Configuration */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Hash size={16} className="text-amber-400" />
              Official Accounting Document Number Prefixes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">Invoice Prefix</label>
                <input
                  type="text"
                  value={settings.invoicePrefix}
                  onChange={(e) => onChange({ invoicePrefix: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
                <span className="text-[10px] text-gray-500 font-mono mt-1 block">e.g. {settings.invoicePrefix}00481</span>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">Receipt Prefix</label>
                <input
                  type="text"
                  value={settings.receiptPrefix}
                  onChange={(e) => onChange({ receiptPrefix: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
                <span className="text-[10px] text-gray-500 font-mono mt-1 block">e.g. {settings.receiptPrefix}00941</span>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">Payment Prefix</label>
                <input
                  type="text"
                  value={settings.paymentPrefix}
                  onChange={(e) => onChange({ paymentPrefix: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
                <span className="text-[10px] text-gray-500 font-mono mt-1 block">e.g. {settings.paymentPrefix}00120</span>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">Credit Note Prefix</label>
                <input
                  type="text"
                  value={settings.creditNotePrefix}
                  onChange={(e) => onChange({ creditNotePrefix: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
                <span className="text-[10px] text-gray-500 font-mono mt-1 block">e.g. {settings.creditNotePrefix}00015</span>
              </div>
            </div>
          </div>

          {/* Tax Rates Matrix */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Percent size={16} className="text-amber-400" />
                  Tax Rates Matrix
                </h4>
                <p className="text-xs text-gray-400">Configured BIR and corporate tax rates available in billing.</p>
              </div>

              <button
                type="button"
                onClick={handleAddTaxRate}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700 rounded-lg text-xs font-bold transition-colors"
              >
                + Add Tax Rule
              </button>
            </div>

            <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden bg-gray-950/60">
              {(settings.taxRates || []).map((tax) => (
                <div key={tax.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{tax.name}</span>
                      <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded text-xs font-mono font-bold">
                        {tax.ratePercent}%
                      </span>
                      {tax.isDefault && (
                        <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-[10px] font-mono">
                          Default VAT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">{tax.description}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteTaxRate(tax.id)}
                      className="text-xs text-rose-400 hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

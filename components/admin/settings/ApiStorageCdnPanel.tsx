import React, { useState } from 'react';
import { 
  HardDrive, Zap, Cpu, Key, Plus, Trash2, RefreshCw, 
  CheckCircle, AlertTriangle, Cloud, Server, Database, Activity 
} from 'lucide-react';
import { ExtendedSystemSettings, ApiKeyItem, WebhookSubscription } from '../../../types';

interface ApiStorageCdnPanelProps {
  settings: ExtendedSystemSettings;
  onChange: (updates: Partial<ExtendedSystemSettings>) => void;
}

export const ApiStorageCdnPanel: React.FC<ApiStorageCdnPanelProps> = ({
  settings,
  onChange
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'api' | 'storage' | 'cdn'>('api');
  const [isPurgingCdn, setIsPurgingCdn] = useState(false);
  const [purgeFeedback, setPurgeFeedback] = useState<string | null>(null);

  // Storage usage calculation simulation
  const usedStorageMb = 34.8;
  const totalStorageMb = (settings.storage?.storageQuotaGb || 100) * 1024;
  const storagePercent = Math.round((usedStorageMb / totalStorageMb) * 100);

  const handlePurgeCdn = async () => {
    if (window.confirm("Are you sure you want to purge all cached edge static assets across Cloudflare nodes? Active visitors will receive fresh origin assets.")) {
      setIsPurgingCdn(true);
      setPurgeFeedback(null);
      await new Promise(r => setTimeout(r, 1500));
      setIsPurgingCdn(false);
      setPurgeFeedback("Edge Cache successfully invalidated across all 280+ Cloudflare data centers.");
      onChange({
        cdn: {
          ...settings.cdn,
          lastPurgedAt: new Date().toISOString()
        }
      });
    }
  };

  const handleCreateApiKey = () => {
    const name = window.prompt("Enter an application name for this new API Key:", "Third-Party Integration");
    if (!name) return;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now().toString(36)}`,
      name,
      prefix: 'sky_live_',
      keyMasked: `sky_live_${Math.random().toString(36).slice(2, 10)}••••••••••••`,
      secretMasked: '••••••••••••••••••••••••••••••••••••••••',
      scopes: ['read:courses', 'read:sessions'],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active',
      createdBy: 'Administrator'
    };

    onChange({ apiKeys: [...(settings.apiKeys || []), newKey] });
  };

  const handleRevokeKey = (keyId: string) => {
    if (window.confirm("Are you sure you want to revoke this API Key? Any application calling endpoints with this key will receive HTTP 401 Unauthorized.")) {
      const next = (settings.apiKeys || []).map(k => (k.id === keyId ? { ...k, status: 'Revoked' as const } : k));
      onChange({ apiKeys: next });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Cpu size={20} />
            </span>
            Infrastructure, Media Storage & Edge CDN
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Manage developer API keys, Webhooks, media upload limits, WebP compression, and Cloudflare CDN edge caching.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('api')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'api' ? 'bg-amber-400 text-gray-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            API & Webhooks
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('storage')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'storage' ? 'bg-amber-400 text-gray-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            Storage & Media
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('cdn')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'cdn' ? 'bg-amber-400 text-gray-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            CDN & Edge Cache
          </button>
        </div>
      </div>

      {/* 1. API KEYS & WEBHOOKS */}
      {activeSubTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key size={16} className="text-amber-400" />
                  REST API Key Tokens
                </h4>
                <p className="text-xs text-gray-400">Scoped credentials for mobile client apps and external LMS integrations.</p>
              </div>
              <button
                type="button"
                onClick={handleCreateApiKey}
                className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                Generate New API Key
              </button>
            </div>

            <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden bg-gray-950/60">
              {(settings.apiKeys || []).map((key) => (
                <div key={key.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{key.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        key.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-gray-400 mt-1">{key.keyMasked}</div>
                    <div className="flex gap-2 mt-2">
                      {key.scopes.map(s => (
                        <span key={s} className="text-[10px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-500">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                    {key.status === 'Active' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-xs text-rose-400 hover:underline px-2 py-1"
                      >
                        Revoke Key
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. STORAGE & MEDIA */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive size={16} className="text-amber-400" />
              Storage Quota & Media Processing
            </h4>

            {/* Quota Bar */}
            <div className="p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Cloud Media Allocated</span>
                <span className="text-white font-mono">{usedStorageMb.toFixed(1)} MB / {settings.storage.storageQuotaGb} GB</span>
              </div>
              <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all rounded-full"
                  style={{ width: `${Math.max(storagePercent, 2)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 text-right">
                99.9% Storage Capacity Available
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                  Primary Storage Provider
                </label>
                <select
                  value={settings.storage.provider}
                  onChange={(e) => onChange({ storage: { ...settings.storage, provider: e.target.value as any } })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white"
                >
                  <option value="firebase">Google Firebase Cloud Storage</option>
                  <option value="s3">Amazon AWS S3 Bucket</option>
                  <option value="bunny">Bunny Storage Edge</option>
                  <option value="local">Local Server Storage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                  Max Single File Upload Limit (MB)
                </label>
                <input
                  type="number"
                  value={settings.storage.maxFileSizeMb}
                  onChange={(e) => onChange({ storage: { ...settings.storage, maxFileSizeMb: Number(e.target.value) } })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Automatic WebP Image Transcoding</div>
                  <div className="text-[11px] text-gray-400">Convert uploaded PNG/JPG to WebP to reduce student mobile bandwidth by 65%.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.storage.autoWebpConversion}
                  onChange={(e) => onChange({ storage: { ...settings.storage, autoWebpConversion: e.target.checked } })}
                  className="rounded border-gray-700 text-amber-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Generate High-Resolution Responsive Thumbnails</div>
                  <div className="text-[11px] text-gray-400">Pre-compute 200x200 and 600x600 preview cuts on upload.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.storage.generateThumbnails}
                  onChange={(e) => onChange({ storage: { ...settings.storage, generateThumbnails: e.target.checked } })}
                  className="rounded border-gray-700 text-amber-400"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 3. CDN & EDGE CACHE */}
      {activeSubTab === 'cdn' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Edge CDN Acceleration & Cache Management
                </h4>
                <p className="text-xs text-gray-400">Global edge caching via Cloudflare CDN network.</p>
              </div>

              <button
                type="button"
                onClick={handlePurgeCdn}
                disabled={isPurgingCdn}
                className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
              >
                <RefreshCw size={14} className={isPurgingCdn ? 'animate-spin' : ''} />
                <span>{isPurgingCdn ? 'Invalidating Edge...' : 'Clear Entire CDN Cache'}</span>
              </button>
            </div>

            {purgeFeedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle size={15} />
                <span>{purgeFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">CDN Origin URL</label>
                <input
                  type="text"
                  value={settings.cdn.cdnUrl}
                  onChange={(e) => onChange({ cdn: { ...settings.cdn, cdnUrl: e.target.value } })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                  placeholder="https://cdn.skylareducation.asia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Edge Cache TTL (Hours)</label>
                <input
                  type="number"
                  value={settings.cdn.cacheTtlHours}
                  onChange={(e) => onChange({ cdn: { ...settings.cdn, cacheTtlHours: Number(e.target.value) } })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

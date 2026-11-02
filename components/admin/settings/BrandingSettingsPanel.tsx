import React, { useState } from 'react';
import { 
  UploadCloud, Image, Trash2, Eye, Download, Check, AlertCircle, 
  RotateCcw, Sparkles, Monitor, Smartphone, Mail, FileText, Layers 
} from 'lucide-react';
import { ExtendedLogoItem } from '../../../types';
import { firebaseClient } from '../../../services/firebaseClient';

interface BrandingSettingsPanelProps {
  logos: ExtendedLogoItem[];
  brandColor: string;
  accentColor: string;
  borderRadius: number;
  sidebarTheme: 'dark' | 'light' | 'color';
  themePreset: 'navy' | 'dark' | 'emerald' | 'crimson';
  onChangeLogos: (logos: ExtendedLogoItem[]) => void;
  onChangeTheme: (updates: {
    brandColor?: string;
    accentColor?: string;
    borderRadius?: number;
    sidebarTheme?: 'dark' | 'light' | 'color';
    themePreset?: 'navy' | 'dark' | 'emerald' | 'crimson';
  }) => void;
}

export const BrandingSettingsPanel: React.FC<BrandingSettingsPanelProps> = ({
  logos,
  brandColor,
  accentColor,
  borderRadius,
  sidebarTheme,
  themePreset,
  onChangeLogos,
  onChangeTheme
}) => {
  const [activePreviewViewport, setActivePreviewViewport] = useState<'header' | 'login' | 'email' | 'invoice' | 'mobile'>('header');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'light'>('checker');

  const handleFileUpload = async (logoId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size limit exceeded. Please upload images under 10MB.");
      return;
    }

    setUploadingId(logoId);
    try {
      let finalUrl = '';
      try {
        finalUrl = await firebaseClient.uploadMedia(file, 'branding', `logo_${logoId}_${Date.now()}.png`);
      } catch (err) {
        // Fallback to Base64 data URL
        finalUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Read image dimensions
      const img = new window.Image();
      img.src = finalUrl;
      img.onload = () => {
        const updated = logos.map(l => {
          if (l.id === logoId) {
            return {
              ...l,
              url: finalUrl,
              dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
              format: file.type.split('/')[1]?.toUpperCase() || 'PNG',
              sizeBytes: file.size,
              updatedAt: new Date().toISOString()
            };
          }
          return l;
        });
        onChangeLogos(updated);
        setUploadingId(null);
      };
      img.onerror = () => {
        const updated = logos.map(l => (l.id === logoId ? { ...l, url: finalUrl, updatedAt: new Date().toISOString() } : l));
        onChangeLogos(updated);
        setUploadingId(null);
      };
    } catch (e) {
      setUploadingId(null);
    }
  };

  const handleRemoveLogo = (logoId: string) => {
    if (window.confirm("Are you sure you want to remove this logo? Default branding fallback will be applied.")) {
      const updated = logos.map(l => (l.id === logoId ? { ...l, url: '', dimensions: undefined, sizeBytes: undefined } : l));
      onChangeLogos(updated);
    }
  };

  const handleToggleActive = (logoId: string) => {
    const updated = logos.map(l => (l.id === logoId ? { ...l, active: !l.active } : l));
    onChangeLogos(updated);
  };

  const mainLogo = logos.find(l => l.type === 'main')?.url || '/skylar-logo.svg';
  const lightLogo = logos.find(l => l.type === 'light')?.url || mainLogo;
  const darkLogo = logos.find(l => l.type === 'dark')?.url || mainLogo;
  const stickyLogo = logos.find(l => l.type === 'sticky')?.url || darkLogo;
  const loadingLogo = logos.find(l => l.type === 'loading')?.url || lightLogo;
  const mobileLogo = logos.find(l => l.type === 'mobile')?.url || mainLogo;

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Image size={20} />
            </span>
            Brand Identity & Multi-Asset Logo Management
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Configure, optimize, and preview official corporate marks across light, dark, sticky header, loading splash screen, mobile, print, and email channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
            {logos.length} Asset Slots Configured
          </span>
        </div>
      </div>

      {/* LIVE VIEWPORT SIMULATOR / PREVIEW */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Live Brand Viewport Simulator
            </span>
          </div>
          {/* Viewport switchers */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800 overflow-x-auto max-w-full">
            {[
              { id: 'header', label: 'Website Header', icon: Monitor },
              { id: 'sticky', label: 'Sticky Header', icon: Monitor },
              { id: 'loading', label: 'Loading Screen', icon: Sparkles },
              { id: 'login', label: 'Login Screen', icon: Layers },
              { id: 'email', label: 'Email Notice', icon: Mail },
              { id: 'invoice', label: 'Invoice / Receipt', icon: FileText },
              { id: 'mobile', label: 'Mobile Nav', icon: Smartphone }
            ].map(vp => {
              const Icon = vp.icon;
              return (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() => setActivePreviewViewport(vp.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    activePreviewViewport === vp.id
                      ? 'bg-amber-400 text-gray-950 font-bold shadow'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{vp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Render Frame */}
        <div className="p-6 rounded-lg bg-gray-950/90 border border-gray-800/80 flex items-center justify-center min-h-[160px]">
          {activePreviewViewport === 'header' && (
            <div className="w-full max-w-xl bg-[#041024] p-4 rounded-xl border border-gray-800 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <img 
                  src={lightLogo || mainLogo} 
                  alt="Header Brand" 
                  className="h-8 w-auto object-contain max-w-[160px]" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-300 font-medium">
                <span>Courses</span>
                <span>Locations</span>
                <span className="px-3 py-1 bg-amber-400 text-gray-950 rounded font-bold text-[11px]">Inquire Now</span>
              </div>
            </div>
          )}

          {(activePreviewViewport as string) === 'sticky' && (
            <div className="w-full max-w-xl bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-gray-200 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={stickyLogo || darkLogo || mainLogo} 
                  alt="Sticky Header Brand" 
                  className="h-7 w-auto object-contain max-w-[150px]" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-700 font-bold">
                <span>Courses</span>
                <span>Locations</span>
                <span className="px-3 py-1 bg-amber-400 text-gray-950 rounded font-bold text-[11px]">Inquire Now</span>
              </div>
            </div>
          )}

          {(activePreviewViewport as string) === 'loading' && (
            <div className="w-full max-w-sm bg-[#192436] p-8 rounded-2xl border border-gray-800 text-center shadow-2xl flex flex-col items-center justify-center space-y-4">
              <img 
                src={loadingLogo || lightLogo || mainLogo} 
                alt="Loading Screen Brand" 
                className="h-12 w-auto object-contain max-w-[220px]" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="w-7 h-7 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin"></div>
              <div className="text-xs font-bold uppercase tracking-widest text-white">SKYLAR EDUCATION ASIA</div>
              <div className="text-[10px] text-gray-400">Connecting to database...</div>
            </div>
          )}

          {activePreviewViewport === 'login' && (
            <div className="w-full max-w-sm bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center shadow-2xl space-y-4">
              <img 
                src={logos.find(l => l.type === 'login')?.url || mainLogo} 
                alt="Login Brand" 
                className="h-10 mx-auto object-contain" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <h4 className="text-sm font-bold text-white">Administrator Access</h4>
              <div className="space-y-2">
                <div className="h-8 bg-gray-800 rounded border border-gray-700 flex items-center px-3 text-xs text-gray-500">admin@skylaredasia.ph</div>
                <div className="h-8 bg-gray-800 rounded border border-gray-700 flex items-center px-3 text-xs text-gray-500">••••••••••••</div>
                <div className="h-8 bg-amber-400 text-gray-950 rounded font-bold text-xs flex items-center justify-center">Sign In to Control Center</div>
              </div>
            </div>
          )}

          {activePreviewViewport === 'email' && (
            <div className="w-full max-w-md bg-white text-gray-900 p-5 rounded-xl shadow-xl space-y-3 font-sans">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <img 
                  src={logos.find(l => l.type === 'email')?.url || mainLogo} 
                  alt="Email Logo" 
                  className="h-7 object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Enrollment Notice</span>
              </div>
              <p className="text-xs text-gray-700 font-semibold">Dear Student,</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Your registration for GWO Basic Safety Training has been confirmed. Please view your induction pack below.
              </p>
              <div className="pt-2">
                <div className="inline-block px-4 py-1.5 bg-[#041024] text-white rounded text-[11px] font-bold">View Training Schedule</div>
              </div>
            </div>
          )}

          {activePreviewViewport === 'invoice' && (
            <div className="w-full max-w-md bg-white text-gray-900 p-5 rounded-xl shadow-xl space-y-3 font-sans border border-gray-200">
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div>
                  <img 
                    src={logos.find(l => l.type === 'invoice')?.url || mainLogo} 
                    alt="Invoice Logo" 
                    className="h-8 object-contain"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="text-[10px] text-gray-500 mt-1">Tax Identification: 009-847-192-00000</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-gray-900">OFFICIAL RECEIPT</div>
                  <div className="text-[10px] text-gray-500 font-mono">#REC-2026-08492</div>
                </div>
              </div>
              <div className="flex justify-between text-xs font-bold pt-1">
                <span>GWO BST Full Certification Fee</span>
                <span className="text-emerald-700">₱42,500.00 PAID</span>
              </div>
            </div>
          )}

          {activePreviewViewport === 'mobile' && (
            <div className="w-64 bg-gray-900 p-3 rounded-2xl border-2 border-gray-700 shadow-2xl space-y-2">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <img 
                  src={mobileLogo || mainLogo} 
                  alt="Mobile Logo" 
                  className="h-6 object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <span className="text-xs text-amber-400 font-bold">☰</span>
              </div>
              <div className="text-[10px] text-gray-400">Mobile Viewport Active (375px)</div>
            </div>
          )}
        </div>
      </div>

      {/* 9 ASSET LOGO GRID HEADER & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Brand Asset Slots</h4>
          <p className="text-[11px] text-gray-400">Manage transparent PNGs/SVGs across all public, mobile, and administrative placements.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 p-1 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-gray-400 px-2">Preview Backdrop:</span>
          <button
            type="button"
            onClick={() => setPreviewBg('checker')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              previewBg === 'checker' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
            }`}
            title="Checkerboard grid (shows true PNG transparency)"
          >
            Checkerboard
          </button>
          <button
            type="button"
            onClick={() => setPreviewBg('dark')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              previewBg === 'dark' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Dark Mode
          </button>
          <button
            type="button"
            onClick={() => setPreviewBg('light')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              previewBg === 'light' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Light Mode
          </button>
        </div>
      </div>

      {/* 9 ASSET LOGO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {logos.map((logo) => {
          const isUploading = uploadingId === logo.id;
          return (
            <div
              key={logo.id}
              className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-lg"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    {logo.name}
                  </h4>
                  <span className="text-[10px] text-amber-400/80 font-mono mt-0.5 block">
                    Slot: {logo.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActive(logo.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    logo.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {logo.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Preview Box with Transparency Checkerboard */}
              <div 
                className={`h-28 rounded-lg border border-gray-800/80 flex items-center justify-center p-3 relative overflow-hidden group transition-colors ${
                  previewBg === 'light' 
                    ? 'bg-white' 
                    : previewBg === 'dark' 
                    ? 'bg-gray-950' 
                    : 'bg-[#0f141d]'
                }`}
                style={
                  previewBg === 'checker'
                    ? {
                        backgroundImage: `
                          linear-gradient(45deg, #18202d 25%, transparent 25%), 
                          linear-gradient(-45deg, #18202d 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #18202d 75%), 
                          linear-gradient(-45deg, transparent 75%, #18202d 75%)
                        `,
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                      }
                    : undefined
                }
              >
                {logo.url ? (
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-center text-gray-600 flex flex-col items-center">
                    <Image size={24} className="mb-1 opacity-50" />
                    <span className="text-[10px]">No custom file uploaded</span>
                    <span className="text-[9px] text-gray-500">Using default fallback</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="text-xs font-bold text-amber-400 animate-pulse flex items-center gap-1.5">
                      <UploadCloud size={16} className="animate-bounce" /> Uploading & Optimizing...
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata & Spec */}
              <div className="space-y-1 text-[11px] text-gray-400 bg-gray-950/40 p-2.5 rounded border border-gray-800/60">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recommended:</span>
                  <span className="font-mono text-gray-300 text-[10px]">{logo.recommendedSize}</span>
                </div>
                {logo.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Spec:</span>
                    <span className="font-mono text-emerald-400 text-[10px]">{logo.dimensions} ({logo.format})</span>
                  </div>
                )}
                <div className="text-[10px] text-gray-500 line-clamp-2 pt-1">
                  {logo.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors border border-gray-700">
                  <UploadCloud size={14} />
                  <span>{logo.url ? 'Replace' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(logo.id, f);
                    }}
                  />
                </label>

                {logo.url && (
                  <>
                    <a
                      href={logo.url}
                      download={`${logo.id}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
                      title="Download Asset"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveLogo(logo.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                      title="Clear custom logo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GLOBAL THEME ACCENT CONTROLS */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-5">
        <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          Color Tokens & Layout Geometry
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-400 mb-2">Primary Brand Tone</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => onChangeTheme({ brandColor: e.target.value })}
                className="w-10 h-10 rounded border border-gray-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs text-white">{brandColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-400 mb-2">Accent Highlight (Gold)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => onChangeTheme({ accentColor: e.target.value })}
                className="w-10 h-10 rounded border border-gray-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-xs text-white">{accentColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-400 mb-2">Corner Radius ({borderRadius}px)</label>
            <input
              type="range"
              min="0"
              max="24"
              value={borderRadius}
              onChange={(e) => onChangeTheme({ borderRadius: Number(e.target.value) })}
              className="w-full accent-amber-400 mt-2"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-gray-400 mb-2">Sidebar Style</label>
            <select
              value={sidebarTheme}
              onChange={(e) => onChangeTheme({ sidebarTheme: e.target.value as any })}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-medium focus:ring-2 focus:ring-amber-400"
            >
              <option value="dark">Deep Navy Midnight</option>
              <option value="light">Crisp Daylight White</option>
              <option value="color">Accent Tinted</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

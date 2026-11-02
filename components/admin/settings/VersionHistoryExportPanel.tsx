import React, { useState } from 'react';
import { 
  History, Download, Upload, RotateCcw, CheckCircle, 
  AlertTriangle, FileText, FileCode, Check, ShieldCheck 
} from 'lucide-react';
import { 
  getSettingsHistory, restoreSettingsVersion, exportSettingsJson, 
  importSettingsJson, getExtendedSettings 
} from '../../../services/storageService';
import { ConfigVersionSnapshot } from '../../../types';

interface VersionHistoryExportPanelProps {
  onRefreshSettings: () => void;
}

export const VersionHistoryExportPanel: React.FC<VersionHistoryExportPanelProps> = ({
  onRefreshSettings
}) => {
  const [history, setHistory] = useState<ConfigVersionSnapshot[]>(getSettingsHistory());
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  const handleExport = (includeSecrets: boolean) => {
    const jsonStr = exportSettingsJson(includeSecrets);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skylar_settings_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) return;
    setImportStatus(null);
    const res = await importSettingsJson(importJsonText, 'Admin Importer');
    setImportStatus(res);
    if (res.success) {
      setHistory(getSettingsHistory());
      onRefreshSettings();
      setImportJsonText('');
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (window.confirm(`Are you sure you want to revert all system configuration back to snapshot ${versionId}? Current state will be captured as a new version before rolling back.`)) {
      setRestoringVersionId(versionId);
      const ok = await restoreSettingsVersion(versionId, 'Super Administrator');
      if (ok) {
        setHistory(getSettingsHistory());
        onRefreshSettings();
        alert(`Successfully rolled back to version ${versionId}!`);
      } else {
        alert("Failed to restore selected configuration version.");
      }
      setRestoringVersionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <History size={20} />
          </span>
          Configuration Version History, Snapshot Rollback & Portable Backup
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Every setting update automatically generates an immutable snapshot. Compare changes, restore prior configurations in 1-click, and export/import encrypted settings packages.
        </p>
      </div>

      {/* EXPORT & IMPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Download size={16} className="text-amber-400" />
            Export Configuration Package
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Download a portable JSON package of all current settings, company details, payment gateways, and branding assets.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleExport(false)}
              className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow"
            >
              <Download size={14} />
              Export (Masked Secrets)
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Exporting with unmasked secrets will contain active API Keys and SMTP passwords. Keep this file strictly confidential.")) {
                  handleExport(true);
                }
              }}
              className="py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-semibold border border-gray-700 transition-colors"
            >
              Export Full
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Upload size={16} className="text-amber-400" />
            Import Configuration JSON
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Paste exported configuration JSON. The parser validates schema integrity before applying changes.
          </p>

          {importStatus && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
              importStatus.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {importStatus.success ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
              <span>{importStatus.message}</span>
            </div>
          )}

          <textarea
            rows={2}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Paste exported JSON package here..."
            className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white font-mono"
          />

          <button
            type="button"
            onClick={handleImport}
            disabled={!importJsonText.trim()}
            className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs border border-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={14} />
            Validate & Restore from JSON
          </button>
        </div>
      </div>

      {/* CONFIGURATION VERSION SNAPSHOTS TABLE */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <History size={16} className="text-amber-400" />
              Automated Configuration Snapshots ({history.length})
            </h4>
            <p className="text-xs text-gray-400">Point-in-time state records created on every save.</p>
          </div>
        </div>

        <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden bg-gray-950/60">
          {history.map((snapshot) => (
            <div
              key={snapshot.versionId}
              className="p-4 flex flex-wrap items-center justify-between gap-4 transition-colors hover:bg-gray-900/40"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                    {snapshot.versionId}
                  </span>
                  <span className="text-xs font-semibold text-gray-300">
                    {snapshot.changeSummary}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Recorded: {new Date(snapshot.timestamp).toLocaleString()} by <span className="text-gray-400">{snapshot.changedBy}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRestoreVersion(snapshot.versionId)}
                  disabled={restoringVersionId === snapshot.versionId}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 border border-gray-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw size={12} className={restoringVersionId === snapshot.versionId ? 'animate-spin' : ''} />
                  Restore Version
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

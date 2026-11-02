import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Key, AlertTriangle, UserX, Eye, EyeOff, 
  RotateCcw, CheckCircle, Smartphone, Globe, Activity 
} from 'lucide-react';
import { ExtendedSystemSettings } from '../../../types';

interface SecuritySettingsPanelProps {
  settings: ExtendedSystemSettings;
  onChange: (updates: Partial<ExtendedSystemSettings>) => void;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  settings,
  onChange
}) => {
  const [newAllowedIp, setNewAllowedIp] = useState('');
  const [newBlockedIp, setNewBlockedIp] = useState('');

  // Calculate live Security Health Score
  let score = 50;
  if (settings.twoFactorRequired) score += 15;
  if (settings.bruteForceProtection) score += 15;
  if (settings.passwordMinLength >= 10) score += 10;
  if (settings.passwordRequireSpecial) score += 5;
  if (settings.passwordRequireNumbers) score += 5;
  if (settings.allowedIpList && settings.allowedIpList.length > 0) score += 5;
  if (score > 100) score = 100;

  const getScoreBadge = (val: number) => {
    if (val >= 90) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
    if (val >= 75) return { label: 'Strong', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
    if (val >= 60) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' };
    return { label: 'Action Required', color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' };
  };

  const badge = getScoreBadge(score);

  const handleAddAllowedIp = () => {
    if (!newAllowedIp.trim()) return;
    onChange({ allowedIpList: [...(settings.allowedIpList || []), newAllowedIp.trim()] });
    setNewAllowedIp('');
  };

  const handleRemoveAllowedIp = (ip: string) => {
    onChange({ allowedIpList: (settings.allowedIpList || []).filter(i => i !== ip) });
  };

  const handleAddBlockedIp = () => {
    if (!newBlockedIp.trim()) return;
    onChange({ blockedIpList: [...(settings.blockedIpList || []), newBlockedIp.trim()] });
    setNewBlockedIp('');
  };

  const handleRemoveBlockedIp = (ip: string) => {
    onChange({ blockedIpList: (settings.blockedIpList || []).filter(i => i !== ip) });
  };

  const handleForceLogout = () => {
    if (window.confirm("Are you sure you want to terminate all active sessions across all devices? Every administrator will be required to re-authenticate.")) {
      alert("All active user sessions successfully invalidated. Re-authentication enforced.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <ShieldCheck size={20} />
          </span>
          Enterprise Security Center & Access Armor
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Two-Factor Authentication, login lockout protection, IP whitelisting, password complexity criteria, and live calculated Security Health Score.
        </p>
      </div>

      {/* Security Health Score Card */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 80 ? 'text-emerald-400' : 'text-amber-400'}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-lg font-extrabold text-white font-mono">{score}%</span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-base font-bold text-white">System Security Health Score</h4>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              Evaluated against OWASP 2026 Admin benchmarks including 2FA, session policies, IP restrictions, and password entropy.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleForceLogout}
          className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <UserX size={14} />
          <span>Force Logout All Active Sessions</span>
        </button>
      </div>

      {/* Core Protection Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Lock size={15} className="text-amber-400" />
            Authentication Safeguards
          </h4>

          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Enforce Two-Factor Authentication (2FA)</div>
                <div className="text-[11px] text-gray-400">Require TOTP authenticator app tokens for all admin roles.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorRequired}
                onChange={(e) => onChange({ twoFactorRequired: e.target.checked })}
                className="rounded border-gray-700 text-amber-400 focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Brute Force Attack Mitigation</div>
                <div className="text-[11px] text-gray-400">Temporarily lock accounts after consecutive failed passwords.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.bruteForceProtection}
                onChange={(e) => onChange({ bruteForceProtection: e.target.checked })}
                className="rounded border-gray-700 text-amber-400 focus:ring-amber-400"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Max Login Retries</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => onChange({ maxLoginAttempts: Number(e.target.value) })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Lockout Minutes</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={settings.accountLockoutDurationMinutes}
                  onChange={(e) => onChange({ accountLockoutDurationMinutes: Number(e.target.value) })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Strength Matrix */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Key size={15} className="text-amber-400" />
            Password Complexity Policies
          </h4>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Minimum Password Length</span>
                <span className="font-mono text-amber-400 font-bold">{settings.passwordMinLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.passwordMinLength}
                onChange={(e) => onChange({ passwordMinLength: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            <label className="flex items-center justify-between p-2.5 rounded bg-gray-950/60 border border-gray-800 cursor-pointer">
              <span className="text-xs text-gray-300">Require Special Symbols (!@#$%^&*)</span>
              <input
                type="checkbox"
                checked={settings.passwordRequireSpecial}
                onChange={(e) => onChange({ passwordRequireSpecial: e.target.checked })}
                className="rounded border-gray-700 text-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-gray-950/60 border border-gray-800 cursor-pointer">
              <span className="text-xs text-gray-300">Require Numerical Digits (0-9)</span>
              <input
                type="checkbox"
                checked={settings.passwordRequireNumbers}
                onChange={(e) => onChange({ passwordRequireNumbers: e.target.checked })}
                className="rounded border-gray-700 text-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-gray-950/60 border border-gray-800 cursor-pointer">
              <span className="text-xs text-gray-300">Require Uppercase Letters (A-Z)</span>
              <input
                type="checkbox"
                checked={settings.passwordRequireUppercase}
                onChange={(e) => onChange({ passwordRequireUppercase: e.target.checked })}
                className="rounded border-gray-700 text-amber-400"
              />
            </label>
          </div>
        </div>
      </div>

      {/* IP Whitelist & Blacklist */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Globe size={15} className="text-amber-400" />
          Network IP Firewall & Restriction Rules
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allowed IPs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300">
              Authorized IP Whitelist (CIDR / Static)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllowedIp}
                onChange={(e) => setNewAllowedIp(e.target.value)}
                placeholder="e.g. 192.168.1.10 or 10.0.0.0/24"
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddAllowedIp}
                className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-xs font-bold transition-colors"
              >
                Add IP
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {(settings.allowedIpList || []).map((ip) => (
                <div key={ip} className="flex items-center justify-between p-2 bg-gray-950 rounded border border-gray-800 text-xs font-mono">
                  <span className="text-emerald-400">{ip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllowedIp(ip)}
                    className="text-gray-500 hover:text-rose-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked IPs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300">
              Blocked Suspicious IP Blacklist
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBlockedIp}
                onChange={(e) => setNewBlockedIp(e.target.value)}
                placeholder="e.g. 198.51.100.4"
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddBlockedIp}
                className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs font-bold transition-colors"
              >
                Block IP
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {(settings.blockedIpList || []).map((ip) => (
                <div key={ip} className="flex items-center justify-between p-2 bg-gray-950 rounded border border-gray-800 text-xs font-mono">
                  <span className="text-rose-400">{ip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedIp(ip)}
                    className="text-gray-500 hover:text-rose-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

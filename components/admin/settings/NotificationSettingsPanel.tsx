import React from 'react';
import { Bell, Check, ShieldAlert, Mail, Smartphone, Monitor } from 'lucide-react';
import { NotificationEventRule } from '../../../types';

interface NotificationSettingsPanelProps {
  rules: NotificationEventRule[];
  onChangeRules: (rules: NotificationEventRule[]) => void;
}

export const NotificationSettingsPanel: React.FC<NotificationSettingsPanelProps> = ({
  rules,
  onChangeRules
}) => {
  const handleToggleChannel = (ruleId: string, channel: 'email' | 'inApp' | 'sms' | 'push' | 'adminAlert' | 'customerAlert') => {
    const next = rules.map(r => (r.id === ruleId ? { ...r, [channel]: !r[channel] } : r));
    onChangeRules(next);
  };

  const handleUpdatePriority = (ruleId: string, priority: 'Low' | 'Medium' | 'High' | 'Critical') => {
    const next = rules.map(r => (r.id === ruleId ? { ...r, priority } : r));
    onChangeRules(next);
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Bell size={20} />
          </span>
          Automated Event Notifications & Dispatch Matrix
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Configure multi-channel alerts (Email, In-App, SMS, Web Push) and notification recipient priorities for each critical operational trigger.
        </p>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">
          <span>System Event Trigger</span>
          <div className="hidden sm:flex items-center gap-6">
            <span className="w-12 text-center">Email</span>
            <span className="w-12 text-center">In-App</span>
            <span className="w-12 text-center">SMS</span>
            <span className="w-12 text-center">Push</span>
            <span className="w-20 text-center">Priority</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-900/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rule.eventName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-amber-300">
                    {rule.category}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Recipients: {rule.adminAlert ? 'Admins ' : ''}{rule.customerAlert ? '• Trainee / Customer' : ''}
                </div>
              </div>

              {/* Channel toggles */}
              <div className="flex items-center gap-6 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleToggleChannel(rule.id, 'email')}
                  className={`w-12 py-1 rounded text-xs font-bold transition-all ${
                    rule.email ? 'bg-amber-400 text-gray-950' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {rule.email ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleChannel(rule.id, 'inApp')}
                  className={`w-12 py-1 rounded text-xs font-bold transition-all ${
                    rule.inApp ? 'bg-amber-400 text-gray-950' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {rule.inApp ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleChannel(rule.id, 'sms')}
                  className={`w-12 py-1 rounded text-xs font-bold transition-all ${
                    rule.sms ? 'bg-amber-400 text-gray-950' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {rule.sms ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleChannel(rule.id, 'push')}
                  className={`w-12 py-1 rounded text-xs font-bold transition-all ${
                    rule.push ? 'bg-amber-400 text-gray-950' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {rule.push ? 'ON' : 'OFF'}
                </button>

                <select
                  value={rule.priority}
                  onChange={(e) => handleUpdatePriority(rule.id, e.target.value as any)}
                  className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-[11px] font-semibold text-white focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

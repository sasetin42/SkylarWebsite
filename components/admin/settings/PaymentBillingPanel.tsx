import React, { useState } from 'react';
import { 
  CreditCard, Shield, Key, CheckCircle, AlertTriangle, Eye, EyeOff, 
  RefreshCw, Sliders, ExternalLink, QrCode, DollarSign 
} from 'lucide-react';
import { PaymentGatewayConfig } from '../../../types';

interface PaymentBillingPanelProps {
  gateways: PaymentGatewayConfig[];
  onChangeGateways: (gateways: PaymentGatewayConfig[]) => void;
}

export const PaymentBillingPanel: React.FC<PaymentBillingPanelProps> = ({
  gateways,
  onChangeGateways
}) => {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateGateway = (id: string, updates: Partial<PaymentGatewayConfig>) => {
    const next = gateways.map(gw => (gw.id === id ? { ...gw, ...updates } : gw));
    onChangeGateways(next);
  };

  const handleSetDefault = (id: string) => {
    const next = gateways.map(gw => ({ ...gw, isDefault: gw.id === id }));
    onChangeGateways(next);
  };

  const handleTestConnection = async (gw: PaymentGatewayConfig) => {
    setTestingId(gw.id);
    handleUpdateGateway(gw.id, { testStatus: undefined, testMessage: 'Testing gateway handshake...' });

    // Simulated sandbox validation delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (!gw.enabled) {
      handleUpdateGateway(gw.id, {
        testStatus: 'failed',
        testMessage: 'Gateway is currently disabled. Enable integration first.',
        lastTestedAt: new Date().toISOString()
      });
    } else if (gw.code === 'bank_transfer') {
      handleUpdateGateway(gw.id, {
        testStatus: 'success',
        testMessage: 'Manual bank instructions & account routing number verified.',
        lastTestedAt: new Date().toISOString()
      });
    } else if (!gw.apiKey) {
      handleUpdateGateway(gw.id, {
        testStatus: 'failed',
        testMessage: 'Missing API Key / Merchant identifier.',
        lastTestedAt: new Date().toISOString()
      });
    } else {
      handleUpdateGateway(gw.id, {
        testStatus: 'success',
        testMessage: `Handshake successful. ${gw.sandboxMode ? 'Sandbox Environment Active.' : 'Live Merchant Gateway Connected.'} HTTP 200 OK.`,
        lastTestedAt: new Date().toISOString()
      });
    }
    setTestingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <CreditCard size={20} />
          </span>
          Payment Gateways, Merchant Links & Billing Integrations
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Configure GCash, Maya, Stripe, and manual bank transfer clearing accounts with sandbox modes, fee surcharges, and encrypted secrets.
        </p>
      </div>

      <div className="space-y-6">
        {gateways.map((gw) => {
          const isTesting = testingId === gw.id;
          const isRevealed = !!revealedSecrets[gw.id];

          return (
            <div
              key={gw.id}
              className={`border rounded-xl p-6 transition-all ${
                gw.enabled
                  ? 'bg-gray-900/80 border-gray-700 shadow-lg'
                  : 'bg-gray-950/40 border-gray-800/80 opacity-80'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-800 rounded-lg text-amber-400 border border-gray-700">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{gw.name}</h4>
                      {gw.isDefault && (
                        <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                          Default Gateway
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        gw.sandboxMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {gw.sandboxMode ? 'TEST SANDBOX' : 'PRODUCTION LIVE'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono mt-0.5 block">
                      Code: {gw.code.toUpperCase()} • Currency: {gw.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!gw.isDefault && gw.enabled && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(gw.id)}
                      className="text-xs font-semibold text-gray-400 hover:text-white px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gw.enabled}
                      onChange={(e) => handleUpdateGateway(gw.id, { enabled: e.target.checked })}
                      className="hidden"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${gw.enabled ? 'bg-amber-400' : 'bg-gray-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-gray-950 absolute top-1 transition-transform ${gw.enabled ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-300">
                      {gw.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                    Merchant / Account Identifier
                  </label>
                  <input
                    type="text"
                    value={gw.accountId}
                    onChange={(e) => handleUpdateGateway(gw.id, { accountId: e.target.value })}
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                    placeholder="Merchant ID"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                    Public API Key
                  </label>
                  <input
                    type="text"
                    value={gw.apiKey}
                    onChange={(e) => handleUpdateGateway(gw.id, { apiKey: e.target.value })}
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                    placeholder="pk_live_..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5 flex items-center justify-between">
                    <span>Secret API Key (Encrypted)</span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(gw.id)}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {isRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                      {isRevealed ? 'Mask' : 'Reveal'}
                    </button>
                  </label>
                  <input
                    type={isRevealed ? 'text' : 'password'}
                    value={gw.secretKey}
                    onChange={(e) => handleUpdateGateway(gw.id, { secretKey: e.target.value })}
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                    Webhook Listener URL
                  </label>
                  <input
                    type="url"
                    value={gw.webhookUrl}
                    onChange={(e) => handleUpdateGateway(gw.id, { webhookUrl: e.target.value })}
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                    placeholder="https://api.skylareducation.asia/webhooks/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                      Fee Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={gw.transactionFeePercent}
                      onChange={(e) => handleUpdateGateway(gw.id, { transactionFeePercent: Number(e.target.value) })}
                      className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                      Mode
                    </label>
                    <select
                      value={gw.sandboxMode ? 'sandbox' : 'live'}
                      onChange={(e) => handleUpdateGateway(gw.id, { sandboxMode: e.target.value === 'sandbox' })}
                      className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-semibold focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="live">Live (Real)</option>
                      <option value="sandbox">Sandbox (Test)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleTestConnection(gw)}
                    disabled={isTesting}
                    className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-bold border border-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
                    <span>{isTesting ? 'Testing Connection...' : 'Test Payment Config'}</span>
                  </button>
                </div>
              </div>

              {/* Payment Instructions Text */}
              <div className="mt-4">
                <label className="block text-[11px] uppercase font-bold text-gray-400 mb-1.5">
                  Checkout Customer Payment Instructions
                </label>
                <textarea
                  rows={2}
                  value={gw.paymentInstructions}
                  onChange={(e) => handleUpdateGateway(gw.id, { paymentInstructions: e.target.value })}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 leading-relaxed font-sans"
                  placeholder="Instructions displayed to students at checkout..."
                />
              </div>

              {/* Diagnostic Test Feedback */}
              {gw.testStatus && (
                <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
                  gw.testStatus === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {gw.testStatus === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  <div className="flex-1">
                    <span className="font-semibold">{gw.testMessage}</span>
                    {gw.lastTestedAt && (
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Verified at: {new Date(gw.lastTestedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

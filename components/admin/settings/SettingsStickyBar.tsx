import React from 'react';
import { Save, RotateCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/Button';

interface SettingsStickyBarProps {
  isDirty: boolean;
  isSaving: boolean;
  isSaved: boolean;
  lastSavedAt?: string;
  lastSavedBy?: string;
  onSave: () => void;
  onCancel: () => void;
  onResetDefaults?: () => void;
}

export const SettingsStickyBar: React.FC<SettingsStickyBarProps> = ({
  isDirty,
  isSaving,
  isSaved,
  lastSavedAt,
  lastSavedBy,
  onSave,
  onCancel,
  onResetDefaults
}) => {
  const formattedTime = lastSavedAt 
    ? new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <div className="sticky bottom-0 z-30 -mx-8 -mb-8 mt-8 px-8 py-4 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
      {/* Left side: Status indicators & Last Saved metadata */}
      <div className="flex items-center gap-3">
        {isSaved ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
            <CheckCircle size={15} />
            <span>Changes successfully synchronized & persisted</span>
          </div>
        ) : isDirty ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <AlertTriangle size={15} />
            <span>Unsaved modifications detected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={14} className="text-gray-500" />
            <span>
              All settings synced. Last saved {formattedTime} by{' '}
              <span className="text-gray-300 font-medium">{lastSavedBy || 'Administrator'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Right side: Action controls */}
      <div className="flex items-center gap-3">
        {onResetDefaults && (
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/30"
          >
            Restore Defaults
          </button>
        )}

        {isDirty && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all"
          >
            <RotateCcw size={13} />
            Discard Changes
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
            isDirty
              ? 'bg-amber-400 hover:bg-amber-500 text-gray-950 shadow-amber-500/20 active:scale-95 cursor-pointer ring-2 ring-amber-400/40'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          }`}
        >
          <Save size={15} className={isSaving ? 'animate-spin' : ''} />
          <span>{isSaving ? 'Saving Configurations...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};

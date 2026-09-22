import React, { useState } from 'react';
import { X, Key, Check, Info, Cpu, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Simulation Engine Settings</h3>
            <p className="text-xs text-slate-400">Configure AI Manager evaluation behavior</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Current Evaluation Mode</span>
            </div>
            {inputKey ? (
              <p className="text-xs text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Live Gemini 1.5/2.0 API Mode Active</span>
              </p>
            ) : (
              <p className="text-xs text-slate-300">
                <strong className="text-white">Smart Built-in Evaluator (Zero Config):</strong> Evaluates submissions with authentic VP operational rubrics, spotting omissions and testing problem-solving without needing an API key.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Optional: Gemini API Key</span>
              {inputKey && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Clear key
                </button>
              )}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Keys are stored strictly in your local browser storage and never sent anywhere other than Google's API.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-1.5 transition"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Apply Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

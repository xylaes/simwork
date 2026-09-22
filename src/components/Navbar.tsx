import React from 'react';
import { Briefcase, CheckCircle2, ShieldAlert, Sparkles, SlidersHorizontal, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentTab: 'inbox' | 'data' | 'studio' | 'dossier';
  setCurrentTab: (tab: 'inbox' | 'data' | 'studio' | 'dossier') => void;
  isCompleted: boolean;
  onOpenSettings: () => void;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isCompleted,
  onOpenSettings,
  hasCustomKey
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: SimWork Platform Brand & Active Company */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 text-slate-950 font-bold shadow-md shadow-brand-500/10">
            <Briefcase className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight">SimWork</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">v0.1-preview</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-slate-300">Apex Global Logistics</span>
              <span className="text-slate-600">•</span>
              <span>Midwest Division</span>
            </div>
          </div>
        </div>

        {/* Center: Workplace Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setCurrentTab('inbox')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'inbox'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            📩 Briefing & Inbox
          </button>
          <button
            onClick={() => setCurrentTab('data')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'data'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            📊 Dispatch Data Explorer
          </button>
          <button
            onClick={() => setCurrentTab('studio')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'studio'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            ✍️ Work Studio & Memo
          </button>
          <button
            onClick={() => setCurrentTab('dossier')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all ${
              currentTab === 'dossier'
                ? 'bg-brand-600 text-white shadow-sm'
                : isCompleted
                ? 'text-brand-400 hover:text-brand-300 hover:bg-brand-950/40 border border-brand-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Proof Dossier</span>
          </button>
        </nav>

        {/* Right: Sprint Status & Settings */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="text-slate-400 font-mono">Day 2 of 5 Sprint</span>
            <span className="text-emerald-400 font-medium">Assigned: Associate Analyst</span>
          </div>

          <button
            onClick={onOpenSettings}
            title="Configure AI & Simulation Settings"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

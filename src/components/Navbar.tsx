import React, { useState } from 'react';
import { Briefcase, CheckCircle2, ShieldAlert, Sparkles, SlidersHorizontal, ChevronDown, Layers } from 'lucide-react';
import { Scenario, SCENARIOS } from '../data/scenarios';

interface NavbarProps {
  currentTab: 'inbox' | 'data' | 'studio' | 'dossier';
  setCurrentTab: (tab: 'inbox' | 'data' | 'studio' | 'dossier') => void;
  isCompleted: boolean;
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isCompleted,
  onOpenSettings,
  hasCustomKey,
  currentScenario,
  onSelectScenario,
}) => {
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: SimWork Platform Brand & Active Company Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 text-slate-950 font-bold shadow-md shadow-brand-500/10">
            <Briefcase className="w-5 h-5 text-slate-950" />
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight">SimWork</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-brand-400 font-mono font-semibold">
                EXPERIENCE SANDBOX
              </span>
            </div>

            {/* Scenario Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition group mt-0.5"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-200 group-hover:text-white">
                  {currentScenario.companyName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
              </button>

              {isScenarioDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-slate-800/60">
                  <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Select Career Simulation Sprint
                  </div>
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectScenario(s);
                        setIsScenarioDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start justify-between ${
                        s.id === currentScenario.id
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-100">{s.companyName}</div>
                        <div className="text-[11px] text-slate-400">{s.roleTitle}</div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        s.statusBadge === 'Active Sprint'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.statusBadge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
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
            📊 Data & Audit Sandbox
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
            <span className="text-slate-400 font-mono">{currentScenario.sprintDuration}</span>
            <span className="text-emerald-400 font-medium">{currentScenario.roleTitle}</span>
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

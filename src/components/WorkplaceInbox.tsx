import React from 'react';
import { Scenario } from '../data/scenarios';
import { Mail, Clock, ArrowRight, ShieldAlert, FileText, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface WorkplaceInboxProps {
  scenario: Scenario;
  onNavigateToData: () => void;
  onNavigateToStudio: () => void;
  isCompleted: boolean;
}

export const WorkplaceInbox: React.FC<WorkplaceInboxProps> = ({
  scenario,
  onNavigateToData,
  onNavigateToStudio,
  isCompleted,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Welcome / Incident Alert Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ACTIVE WORK SPRINT • INCIDENT #OPS-3921</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {scenario.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              You are assigned as <strong>{scenario.roleTitle}</strong> at <strong>{scenario.companyName}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToData}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center space-x-2 transition"
            >
              <span>Explore Raw Dispatch Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Email Thread from Sarah Lin */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Email Header */}
        <div className="p-5 bg-slate-950/70 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start space-x-3.5">
            <img
              src={scenario.manager.avatar}
              alt={scenario.manager.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-700 mt-0.5"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{scenario.manager.name}</span>
                <span className="text-xs text-slate-500 font-mono">&lt;{scenario.manager.email}&gt;</span>
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">
                {scenario.briefing.urgentSubject}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-1">
                <span>To: me (Associate Operations Analyst)</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{scenario.briefing.receivedTime}</span>
                </span>
              </div>
            </div>
          </div>

          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            High Priority
          </span>
        </div>

        {/* Email Body */}
        <div className="p-6 text-xs text-slate-300 space-y-4 leading-relaxed font-sans whitespace-pre-line border-b border-slate-800">
          {scenario.briefing.emailBody}
        </div>

        {/* Attached Targets & Quick Launch */}
        <div className="p-5 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Attachment: <strong>midwest_q3_dispatch_logs.csv</strong> (40 records loaded)</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onNavigateToData}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Inspect Data Rows
            </button>
            <button
              onClick={onNavigateToStudio}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center space-x-1.5 shadow-md shadow-brand-600/20 transition"
            >
              <span>Open Work Studio & Draft Memo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

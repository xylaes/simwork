import React from 'react';
import { EvaluationResult } from '../services/evaluatorService';
import { Scenario } from '../data/scenarios';
import { CheckCircle2, AlertCircle, Award, ArrowRight, RotateCcw, X, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
  scenario: Scenario;
  onAcceptAndUnlock: () => void;
}

export const ManagerReviewModal: React.FC<ManagerReviewModalProps> = ({
  isOpen,
  onClose,
  result,
  scenario,
  onAcceptAndUnlock,
}) => {
  if (!isOpen || !result) return null;

  const handleUnlock = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onAcceptAndUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Manager Header */}
        <div className="flex items-center space-x-4 pb-5 border-b border-slate-800">
          <img
            src={scenario.manager.avatar}
            alt={scenario.manager.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-brand-500/40 shadow"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">{scenario.manager.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {scenario.manager.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Formal Executive Review • {scenario.companyName}</p>
          </div>
        </div>

        {/* Score & Verdict Banner */}
        <div className="my-5 p-4 rounded-xl flex items-center justify-between border bg-slate-950/70 border-slate-800">
          <div className="flex items-center space-x-3">
            {result.passed ? (
              <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Evaluation Verdict</span>
              <h4 className={`text-base font-bold ${result.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.status}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-mono block">Rigor Score</span>
            <span className="text-2xl font-black font-mono text-white">
              {result.score}<span className="text-xs text-slate-500">/100</span>
            </span>
          </div>
        </div>

        {/* Manager Commentary Quote */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-5 relative">
          <MessageSquare className="w-4 h-4 text-slate-600 absolute top-3 right-3" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
            Executive Commentary
          </p>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{result.managerCommentary}"
          </p>
        </div>

        {/* Strengths and Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs">
          
          <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-900/30 space-y-2">
            <span className="font-semibold text-emerald-400 flex items-center space-x-1.5">
              <span>✓ Identified & Executed</span>
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {result.strengths.map((str, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-semibold text-amber-400 flex items-center space-x-1.5">
              <span>⚡ Strategic Stress Test</span>
            </span>
            <p className="text-[11px] text-slate-300 italic leading-relaxed">
              "{result.followUpChallenge}"
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refine Draft</span>
          </button>

          {result.passed ? (
            <button
              onClick={handleUnlock}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-2 shadow-lg shadow-brand-600/25 transition active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Unlock Verified Proof Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white"
            >
              Update Memo & Resubmit
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

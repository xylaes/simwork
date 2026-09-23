import React, { useState } from 'react';
import { EvaluationResult } from '../services/evaluatorService';
import { Scenario } from '../data/scenarios';
import { CheckCircle2, AlertCircle, Award, ArrowRight, RotateCcw, X, MessageSquare, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
  scenario: Scenario;
  onAcceptAndUnlock: () => void;
  onSubmitStressTestDefense: (defense: string) => Promise<void>;
  isEvaluatingDefense: boolean;
}

export const ManagerReviewModal: React.FC<ManagerReviewModalProps> = ({
  isOpen,
  onClose,
  result,
  scenario,
  onAcceptAndUnlock,
  onSubmitStressTestDefense,
  isEvaluatingDefense,
}) => {
  const [rebuttalText, setRebuttalText] = useState('');
  const [showStressTestInput, setShowStressTestInput] = useState(false);

  if (!isOpen || !result) return null;

  const handleUnlock = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
    onAcceptAndUnlock();
  };

  const handleDefend = async () => {
    if (!rebuttalText.trim()) return;
    await onSubmitStressTestDefense(rebuttalText);
  };

  const handleLoadSampleDefense = () => {
    setRebuttalText(
      `To cap spot brokers at 10% without dropping SLAs during holiday volume spikes, we will execute a two-pronged strategy:\n\n1. Dedicated Contract Capacity: Rather than buying on the volatile spot market in November, we will lock in secondary carrier partner agreements at pre-committed dedicated rates ($3.10/mi) 6 weeks in advance.\n2. Cross-Dock Drop-and-Hook: Stagger deliveries into nighttime drop-and-hook shifts at our Chicago and Detroit hubs. By staging pre-loaded trailers, we decouple driver arrival from warehouse unloading, eliminating the 3.5hr dwell bottlenecks and freeing our own fleet drivers to run 25% more turns per week.`
    );
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
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Executive Evaluation</span>
              <h4 className={`text-base font-bold ${result.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.status}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-mono block">Analytical Rigor</span>
            <span className="text-2xl font-black font-mono text-white">
              {result.score}<span className="text-xs text-slate-500">/100</span>
            </span>
          </div>
        </div>

        {/* Manager Commentary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-5 relative">
          <MessageSquare className="w-4 h-4 text-slate-600 absolute top-3 right-3" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
            {scenario.manager.name}'s Feedback
          </p>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{result.managerCommentary}"
          </p>
        </div>

        {/* Strengths & Audit Checklist */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mb-5 text-xs">
          <span className="font-semibold text-emerald-400 flex items-center space-x-1.5">
            <span>✓ Verified Competencies in Audit</span>
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className={`p-2 rounded border ${result.auditMetrics.spotBrokerIdentified ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              Spot-Broker Rate Premium ({result.auditMetrics.spotBrokerIdentified ? 'Identified' : 'Missed'})
            </div>
            <div className={`p-2 rounded border ${result.auditMetrics.detentionBottleneckIdentified ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              Cross-Dock Dwell Bottlenecks ({result.auditMetrics.detentionBottleneckIdentified ? 'Identified' : 'Missed'})
            </div>
            <div className={`p-2 rounded border ${result.auditMetrics.fuelIndexingIdentified ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              Fuel Surcharge Pass-Through ({result.auditMetrics.fuelIndexingIdentified ? 'Identified' : 'Missed'})
            </div>
            <div className="p-2 rounded border bg-slate-900 border-slate-800 text-slate-300">
              Quantitative Rigor: {result.auditMetrics.quantitativeRigorScore}/10
            </div>
          </div>
        </div>

        {/* Live Stage 2 Stress-Test Section */}
        {result.passed && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-900/40 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-400 text-xs flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Stage 2: Live Executive Stress-Test</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800">
                Anti-Cheat Defense
              </span>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              "{result.followUpChallenge}"
            </p>

            {result.stressTestVerdict ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800 text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Executive Defense Accepted</span>
                  <span className="font-mono text-xs">{result.stressTestVerdict.defenseScore}/100</span>
                </div>
                <p className="text-slate-300 italic text-[11px]">
                  "{result.stressTestVerdict.managerFeedback}"
                </p>
              </div>
            ) : showStressTestInput ? (
              <div className="space-y-2 pt-1 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Defend your strategy to the VP:</span>
                  <button
                    onClick={handleLoadSampleDefense}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Load Benchmark Defense
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={rebuttalText}
                  onChange={(e) => setRebuttalText(e.target.value)}
                  placeholder="Explain how you will mitigate the holiday volume surge without relying on spot brokers..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleDefend}
                  disabled={!rebuttalText.trim() || isEvaluatingDefense}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  {isEvaluatingDefense ? (
                    <span>Sarah Lin is evaluating defense...</span>
                  ) : (
                    <>
                      <span>Submit Defense to VP</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowStressTestInput(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition"
              >
                Respond to Stress-Test & Lock Proof Score →
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refine Memo</span>
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

import React, { useState } from 'react';
import { Scenario } from '../data/scenarios';
import { EvaluationResult } from '../services/evaluatorService';
import { ShieldCheck, Copy, Check, ExternalLink, Download, Sparkles, Building, User, Calendar, Share2 } from 'lucide-react';

interface ProofDossierProps {
  scenario: Scenario;
  result: EvaluationResult | null;
  memoContent: string;
}

export const ProofDossier: React.FC<ProofDossierProps> = ({
  scenario,
  result,
  memoContent,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const verificationId = 'APX-2025-9941X';
  const verificationDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://simwork.io/verify/${verificationId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner / Verification Callout */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Verified Operational Proof Dossier
                </span>
                <span className="text-xs px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {verificationId}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {scenario.roleTitle} — {scenario.companyName}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Public Verification Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Resume Assets Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white">
              Quantifiable Resume & LinkedIn Experience Bullets
            </h3>
          </div>
          <span className="text-xs text-slate-400">ATS-Optimized Action Formatting</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Drop these bullet points directly into the <strong>Experience / Projects</strong> section of your resume. They demonstrate real-world operational problem-solving rather than passive coursework.
        </p>

        <div className="space-y-3">
          {scenario.resumeBulletTemplates.map((template, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-4 group"
            >
              <div className="text-xs text-slate-200 leading-relaxed font-sans">
                <span className="font-semibold text-brand-300">• {template.action}</span>: {template.impact}
              </div>

              <button
                onClick={() => handleCopyBullet(template.fullBullet, idx)}
                className="opacity-80 group-hover:opacity-100 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shrink-0"
                title="Copy bullet"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* The Verifiable Proof Dossier Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Header Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-mono block">CANDIDATE ROLE</span>
            <span className="font-semibold text-white mt-1 block">{scenario.roleTitle}</span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">ORGANIZATION</span>
            <span className="font-semibold text-white mt-1 block">{scenario.companyName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">VERIFIED BY</span>
            <span className="font-semibold text-white mt-1 block">{scenario.manager.name} ({scenario.manager.title})</span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">DATE VERIFIED</span>
            <span className="font-mono text-emerald-400 mt-1 block">{verificationDate}</span>
          </div>
        </div>

        {/* Manager Review Endorsement */}
        {result && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Sign-Off & Competency Evaluation</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "{result.managerCommentary}"
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                Rigor Score: {result.score}/100
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono">
                Status: {result.status}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                40 Dispatch Records Audited
              </span>
            </div>
          </div>
        )}

        {/* Executive Memo Artifact Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Workplace Deliverable Artifact</h4>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {memoContent || 'No memo content submitted yet.'}
          </div>
        </div>

      </div>

    </div>
  );
};

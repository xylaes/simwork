import React, { useState } from 'react';
import { Scenario } from '../data/scenarios';
import { Send, Sparkles, FileText, CheckCircle, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';

interface WorkStudioProps {
  scenario: Scenario;
  onSubmit: (memo: string) => void;
  isEvaluating: boolean;
}

const SAMPLE_ANALYSIS_DRAFT = `# Executive Operations Memo: Midwest Regional Margin Contraction
**To:** Sarah Lin, VP of Regional Operations
**From:** Associate Operations & Data Analyst
**Date:** October 14, 2025
**Subject:** Q3 Midwest Gross Margin Collapse Diagnosis & Q4 Recovery Plan

---

### 1. Executive Summary & Core Diagnosis
Despite parcel volume increasing by +11.8% in Q3, Midwest net delivery margin contracted by 820 bps (from 18.4% down to 10.2%). Our dispatch data audit isolates three primary operational leakages:

1. **Uncontrolled 3rd-Party Broker Surcharges (Spot Market Over-Reliance)**
   - Broker dispatches cost on average **$4.12/mile**, representing a **68% premium** over our internal Apex Fleet baseline ($2.45/mile). 
   - Broker runs were repeatedly triggered on the Chicago–Detroit and Cleveland lanes due to poor load-scheduling buffers.

2. **Cross-Dock Detention Inducing Severe Driver Overtime**
   - Dwell times at the Chicago and Detroit cross-dock depots averaged **3.2 to 4.5 hours** per run.
   - This detention directly triggered 1.5x driver overtime penalties (+3.5 to +4.5 hours OT per run), burning unnecessary labor capital while trucks sat idling.

3. **Fuel Surcharge Indexing Lag**
   - Diesel costs escalated 14% over Q3. While Apex Fleet absorbed these direct costs, our billing department failed to pass through dynamic fuel surcharges to enterprise accounts (specifically GreatLakes Retail).

---

### 2. Financial Quantification
- **Excess Broker Spot Premium:** ~$84,000/month in avoidable spot-market markups across overflow lanes.
- **Overtime & Cross-Dock Idling:** ~$38,000/month in driver 1.5x overtime and excess fuel burn caused by depot bottlenecks.
- **Uncollected Fuel Surcharges:** ~$20,000/month in unbilled pass-through expenses.
- **Total Monthly Margin Leakage:** **~$142,000 / month**.

---

### 3. Immediate Action Plan for Q4
1. **Implement Staggered Cross-Dock Receiving Slots:** Cap yard detention at 90 minutes with pre-staged drop-and-hook trailers in Chicago. Projected to eliminate 75% of driver overtime.
2. **Dedicated Lane Sub-Contracting:** Transition away from emergency broker spot rates; negotiate pre-committed dedicated partner rates at $3.10/mile for volume surges.
3. **Automate Weekly Fuel Indexing:** Immediately apply DOE Midwest diesel price index pass-through surcharges to GreatLakes Retail and Northern Grocery invoices.

**Expected Impact:** Projected recovery of **680 bps of EBITDA gross margin** by late Q4 without fleet expansion or driver headcount reductions.`;

export const WorkStudio: React.FC<WorkStudioProps> = ({
  scenario,
  onSubmit,
  isEvaluating,
}) => {
  const [memoText, setMemoText] = useState('');
  const [activeHintTab, setActiveHintTab] = useState<'brief' | 'rubric' | 'guide'>('brief');

  const handleLoadSample = () => {
    setMemoText(SAMPLE_ANALYSIS_DRAFT);
  };

  const handleClear = () => {
    setMemoText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Context & Guidelines (4 cols) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Memo Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <img
              src={scenario.manager.avatar}
              alt={scenario.manager.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h4 className="text-sm font-semibold text-white">{scenario.manager.name}</h4>
              <p className="text-xs text-slate-400">{scenario.manager.title}</p>
            </div>
          </div>

          <div className="flex border-b border-slate-800 text-xs mt-3">
            <button
              onClick={() => setActiveHintTab('brief')}
              className={`pb-2 px-2 font-medium transition ${
                activeHintTab === 'brief'
                  ? 'border-b-2 border-brand-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Assignment Brief
            </button>
            <button
              onClick={() => setActiveHintTab('rubric')}
              className={`pb-2 px-2 font-medium transition ${
                activeHintTab === 'rubric'
                  ? 'border-b-2 border-brand-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grading Rubric
            </button>
            <button
              onClick={() => setActiveHintTab('guide')}
              className={`pb-2 px-2 font-medium transition ${
                activeHintTab === 'guide'
                  ? 'border-b-2 border-brand-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyst Tips
            </button>
          </div>

          <div className="pt-3 text-xs text-slate-300">
            {activeHintTab === 'brief' && (
              <div className="space-y-3">
                <p className="text-slate-400 italic">
                  "{scenario.briefing.emailBody.split('\n\n')[1]}"
                </p>
                <div>
                  <span className="font-semibold text-white block mb-1">Key Deliverables:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {scenario.briefing.targetObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeHintTab === 'rubric' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/40">
                  <span className="font-semibold text-emerald-400 block mb-1">Must Cover:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    {scenario.evaluationRubric.keyInsightsExpected.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/40">
                  <span className="font-semibold text-rose-400 block mb-1">Watch Out (Pitfalls):</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    {scenario.evaluationRubric.criticalPitfalls.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeHintTab === 'guide' && (
              <div className="space-y-2 text-slate-400">
                <p>💡 <strong>Structure matters:</strong> Executives read bottom-line up. Lead with the core findings and quantified financial metrics.</p>
                <p>💡 <strong>Avoid finger-pointing:</strong> Don't blame drivers or suggest broad layoffs; explain operational root causes (cross-dock bottlenecks and dwell).</p>
                <p>💡 <strong>Test the flow:</strong> You can click <span className="text-brand-400 font-medium">"Load Benchmark Analysis"</span> to test the manager evaluation engine immediately.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Memo Composer (7 cols) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white">Executive Operations Memo Editor</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSample}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 border border-slate-700 flex items-center space-x-1 transition"
              title="Fill with high-quality benchmark analysis to see review & dossier flow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Benchmark Analysis</span>
            </button>
            {memoText && (
              <button
                onClick={handleClear}
                className="text-xs p-1 text-slate-500 hover:text-rose-400 transition"
                title="Clear editor"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <textarea
            rows={18}
            placeholder="Draft your executive memo to Sarah Lin here...

Include:
- Root cause breakdown (Fleet vs 3rd-party broker, driver overtime, fuel surcharges)
- Financial quantification of leaks
- 3 prioritized operational recommendations for Q4"
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 leading-relaxed resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 font-mono">
            {memoText.trim().split(/\s+/).filter(Boolean).length} words
          </div>

          <button
            onClick={() => onSubmit(memoText)}
            disabled={!memoText.trim() || isEvaluating}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              !memoText.trim() || isEvaluating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 active:scale-95'
            }`}
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Sarah Lin is reviewing...</span>
              </>
            ) : (
              <>
                <span>Submit to VP for Review</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

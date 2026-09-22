import React, { useState, useEffect } from 'react';
import { APEX_LOGISTICS_SCENARIO } from './data/scenarios';
import { evaluateMemo, EvaluationResult } from './services/evaluatorService';
import { Navbar } from './components/Navbar';
import { WorkplaceInbox } from './components/WorkplaceInbox';
import { DataExplorer } from './components/DataExplorer';
import { WorkStudio } from './components/WorkStudio';
import { ManagerReviewModal } from './components/ManagerReviewModal';
import { ProofDossier } from './components/ProofDossier';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'inbox' | 'data' | 'studio' | 'dossier'>('inbox');
  const [memoContent, setMemoContent] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('simwork_gemini_key') || '');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const scenario = APEX_LOGISTICS_SCENARIO;

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('simwork_gemini_key', key);
  };

  const handleSubmitMemo = async (memo: string) => {
    setMemoContent(memo);
    setIsEvaluating(true);

    try {
      const result = await evaluateMemo(memo, scenario, apiKey);
      setEvaluationResult(result);
      setIsReviewModalOpen(true);

      if (result.passed) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAcceptAndUnlock = () => {
    setIsReviewModalOpen(false);
    setCurrentTab('dossier');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCompleted={isCompleted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(apiKey)}
      />

      {/* Main Workplace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'inbox' && (
          <WorkplaceInbox
            scenario={scenario}
            onNavigateToData={() => setCurrentTab('data')}
            onNavigateToStudio={() => setCurrentTab('studio')}
            isCompleted={isCompleted}
          />
        )}

        {currentTab === 'data' && (
          <DataExplorer data={scenario.sampleDispatchData} />
        )}

        {currentTab === 'studio' && (
          <WorkStudio
            scenario={scenario}
            onSubmit={handleSubmitMemo}
            isEvaluating={isEvaluating}
          />
        )}

        {currentTab === 'dossier' && (
          <ProofDossier
            scenario={scenario}
            result={evaluationResult}
            memoContent={memoContent}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 bg-slate-950/80 text-center text-xs text-slate-500 font-mono">
        SimWork • The Experience Sandbox • Bridging the Entry-Level Experience Divide
      </footer>

      {/* Manager Review Modal */}
      <ManagerReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        result={evaluationResult}
        scenario={scenario}
        onAcceptAndUnlock={handleAcceptAndUnlock}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

    </div>
  );
};

export default App;

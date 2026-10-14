/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { QuickEscapeModal } from './components/QuickEscapeModal';
import { StudentView } from './components/student/StudentView';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { CoordinatorLoginGate } from './components/coordinator/CoordinatorLoginGate';
import { EducationalHub } from './components/education/EducationalHub';
import { getStoredReports } from './services/storage';
import { BullyingReport } from './types';
import { Heart, ShieldCheck, Phone, Scale } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('student');
  const [reports, setReports] = useState<BullyingReport[]>([]);
  const [isQuickEscapeActive, setIsQuickEscapeActive] = useState<boolean>(false);
  const [isCoordinatorAuthenticated, setIsCoordinatorAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('escola_segura_coord_auth') === 'true';
  });

  // Load initial reports from persistent storage
  useEffect(() => {
    const loaded = getStoredReports();
    setReports(loaded);
  }, []);

  // Listen to keyboard shortcut 'Escape' for panic/quick exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickEscapeActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerQuickEscape = () => {
    setIsQuickEscapeActive(true);
    // Lock the coordination dashboard if active, preventing unauthorized views
    setIsCoordinatorAuthenticated(false);
    sessionStorage.removeItem('escola_segura_coord_auth');
  };

  const handleCoordinatorLogout = () => {
    setIsCoordinatorAuthenticated(false);
    sessionStorage.removeItem('escola_segura_coord_auth');
    setCurrentTab('student');
  };

  const newReportsCount = reports.filter((r) => r.status === 'novo').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decoy panic overlay if active */}
      <QuickEscapeModal
        isOpen={isQuickEscapeActive}
        onClose={() => setIsQuickEscapeActive(false)}
      />

      {/* Top Banner with 24h Helplines & Anonymity Pledge */}
      <EmergencyBanner />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onQuickEscape={handleTriggerQuickEscape}
        newReportsCount={newReportsCount}
        isCoordinatorAuthenticated={isCoordinatorAuthenticated}
      />

      {/* Main Body */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full">
        {currentTab === 'student' && (
          <StudentView
            onGoToEducation={() => setCurrentTab('education')}
            onGoToCoordinator={() => setCurrentTab('coordinator')}
          />
        )}

        {currentTab === 'coordinator' && (
          isCoordinatorAuthenticated ? (
            <CoordinatorDashboard
              reports={reports}
              onReportsChange={(updated) => setReports(updated)}
              onLogout={handleCoordinatorLogout}
            />
          ) : (
            <CoordinatorLoginGate
              onAuthenticated={() => setIsCoordinatorAuthenticated(true)}
              onCancel={() => setCurrentTab('student')}
            />
          )
        )}

        {currentTab === 'education' && <EducationalHub />}
      </main>

      {/* Educational & Protective Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-xs text-slate-500 py-8 px-4 sm:px-6 no-print">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Escola Segura · Sistema Inteligente Contra Bullying</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Desenvolvido com foco no acolhimento de alunos, segurança psicológica e em conformidade com as Leis 13.185/2016 e 14.811/2024.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> CVV: 188 (Gratuito)
            </span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-400" /> Disque 100
            </span>
            <button
              onClick={() => setIsQuickEscapeActive(true)}
              className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              Botão de Pânico (ESC)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

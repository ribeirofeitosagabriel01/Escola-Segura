import React from 'react';
import { ShieldAlert, Users, GraduationCap, BookOpen, AlertTriangle } from 'lucide-react';

export type NavTab = 'student' | 'coordinator' | 'education';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickEscape: () => void;
  newReportsCount: number;
  isCoordinatorAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickEscape,
  newReportsCount,
  isCoordinatorAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                Escola Segura
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                · Sistema Antibullying
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Canal de denúncias confidenciais e acolhimento com inteligência pedagógica
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Functional Segmented Control) */}
        <nav className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => onSelectTab('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'student'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Espaço do Aluno</span>
          </button>

          <button
            onClick={() => onSelectTab('coordinator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer relative ${
              currentTab === 'coordinator'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Coordenação</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
              isCoordinatorAuthenticated ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-200'
            }`}>
              {isCoordinatorAuthenticated ? 'Liberado' : 'Restrito'}
            </span>
            {newReportsCount > 0 && isCoordinatorAuthenticated && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full font-bold">
                {newReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('education')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'education'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guia de Apoio & Leis</span>
            <span className="sm:hidden">Guia</span>
          </button>
        </nav>

        {/* Quick Escape Button */}
        <div>
          <button
            onClick={onQuickEscape}
            title="Clique para ocultar esta tela imediatamente caso alguém chegue perto"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Saída Rápida</span>
            <span className="text-[10px] text-rose-500 hidden lg:inline">(ESC)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

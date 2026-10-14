import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, X } from 'lucide-react';

interface QuickEscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickEscapeModal: React.FC<QuickEscapeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Decoy Navigation mimicking an educational resource */}
      <header className="border-b border-slate-200 px-6 py-3 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-slate-800 text-sm">Biblioteca Escolar Digital · Material de Pesquisa</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open('https://pt.wikipedia.org', '_blank')}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white"
          >
            Ir para Wikipedia <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded"
            title="Voltar ao sistema com discrição"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Decoy Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 overflow-y-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>Modo de Proteção Rápida Ativado:</strong> O conteúdo da tela foi substituído para garantir sua privacidade caso alguém tenha se aproximado.
            Quando estiver seguro, você pode fechar esta tela clicando no "X" no canto superior direito.
          </div>
        </div>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">História da Ciência: A Revolução Científica do Século XVII</h1>
          <p className="text-sm text-slate-500 mb-6">Guia de Apoio Didático · Ciências e Humanidades</p>

          <p className="text-slate-700 leading-relaxed text-sm mb-4">
            A Revolução Científica corresponde ao período de transformações profundas nas bases do conhecimento natural que teve lugar na Europa entre a metade do século XVI e o final do século XVIII. Teve como marcos fundamentais a obra astronômica de Nicolau Copérnico, as formulações de Johannes Kepler, os experimentos mecânicos de Galileu Galilei e a síntese universal proposta por Isaac Newton.
          </p>

          <h2 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Principais Fundamentos Metodológicos</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 mb-6">
            <li><strong>Empirismo:</strong> observação sistemática e verificação experimental dos fenômenos observados.</li>
            <li><strong>Matematização da Natureza:</strong> aplicação de formulações algébricas e geométricas para descrever leis naturais.</li>
            <li><strong>Rejeição do Princípio de Autoridade:</strong> superação de dogmas antigos pela comprovação empírica replicável.</li>
          </ul>

          <p className="text-slate-700 leading-relaxed text-sm">
            O impacto dessas transformações alterou de maneira definitiva a compreensão humana sobre o cosmos, abrindo caminho para o Iluminismo e os desenvolvimentos tecnológicos da era moderna.
          </p>
        </article>
      </main>
    </div>
  );
};

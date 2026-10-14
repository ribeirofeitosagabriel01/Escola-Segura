import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Lock,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  EyeOff,
  BellRing
} from 'lucide-react';
import { ReportBullyingFlow } from './ReportBullyingFlow';
import { TrackReportView } from './TrackReportView';
import { BullyingReport } from '../../types';

interface StudentViewProps {
  onGoToEducation: () => void;
  onGoToCoordinator: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ onGoToEducation, onGoToCoordinator }) => {
  const [mode, setMode] = useState<'home' | 'report' | 'track'>('home');
  const [selectedTrackingCode, setSelectedTrackingCode] = useState<string>('');
  const [quickCodeInput, setQuickCodeInput] = useState('');

  const handleReportSuccess = (report: BullyingReport) => {
    setSelectedTrackingCode(report.trackingCode);
    setMode('track');
  };

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCodeInput.trim()) return;
    setSelectedTrackingCode(quickCodeInput.trim().toUpperCase());
    setMode('track');
  };

  if (mode === 'report') {
    return (
      <ReportBullyingFlow
        onSuccess={handleReportSuccess}
        onCancel={() => setMode('home')}
      />
    );
  }

  if (mode === 'track') {
    return (
      <TrackReportView
        initialCode={selectedTrackingCode}
        onBackToHome={() => {
          setSelectedTrackingCode('');
          setMode('home');
        }}
      />
    );
  }

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Background Subtle Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Canal 100% Anônimo, Seguro e Confidencial
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Você tem voz. <br />
            Denuncie o bullying sem medo de represálias.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Em muitas escolas, o medo e a vergonha silenciam quem sofre ou presencia agressões.
            Aqui você relata com total segurança: nenhuma informação pessoal sua é pedida,
            e o caso vai direto para a coordenação pedagógica tomar providências discretas.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setMode('report')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition-all shadow-md hover:shadow-indigo-500/25 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              Denunciar Bullying Agora
            </button>

            <button
              onClick={() => setMode('track')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/20 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-300" />
              Acompanhar Minha Denúncia
            </button>
          </div>
        </div>

        {/* Quick Tracking input in hero corner */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nenhum IP, e-mail ou nome é rastreado ou gravado.</span>
          </div>

          <form onSubmit={handleQuickTrackSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={quickCodeInput}
              onChange={(e) => setQuickCodeInput(e.target.value)}
              placeholder="Código de protocolo (ex: SEG-8419)"
              className="bg-white/10 text-white placeholder:text-slate-400 text-xs px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400 uppercase font-mono w-full sm:w-56"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Como Funciona (matching prompt 4 steps) */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
            Simples, Seguro e Discreto
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Como funciona o sistema na escola?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quatro passos pensados para proteger os estudantes e eliminar o medo de retaliações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {[
            {
              step: '1',
              title: 'Acesse o Sistema',
              description: 'Entre pelo celular, tablet ou computador da escola a qualquer momento, sem login obrigatório.',
              icon: '📲',
            },
            {
              step: '2',
              title: 'Clique em Denunciar',
              description: 'Selecione a opção de relato e escolha se você é a vítima ou se presenciou a situação.',
              icon: '🛡️',
            },
            {
              step: '3',
              title: 'Conte o que e onde houve',
              description: 'Descreva a situação, local (pátio, sala, WhatsApp) e quando ocorreu, sem expor seu nome.',
              icon: '✍️',
            },
            {
              step: '4',
              title: 'Apoio e Ação Pedagógica',
              description: 'A coordenação recebe a mensagem criptografada, toma medidas protetivas e você acompanha pelo código.',
              icon: '🤝',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  PASSO {item.step}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios para a Comunidade Escolar */}
      <section className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
        <div className="max-w-xl mb-6">
          <span className="text-xs uppercase font-bold text-indigo-700 tracking-wider">
            Transformando o Clima Escolar
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Por que este sistema protege toda a escola?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <HeartHandshake className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              Ajuda quem tem medo de falar
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Alunos tímidos ou coagidos conseguem pedir socorro sem se expor a julgamentos ou ameaças de agressores.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              Diminui casos de violência
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              A identificação precoce de comportamentos hostis impede que conflitos pequenos se agravem.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <UserCheck className="w-5 h-5 text-blue-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              Melhora a convivência
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              O pátio, as salas de aula e os banheiros tornam-se espaços monitorados com empatia e respeito mútuo.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <Sparkles className="w-5 h-5 text-amber-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              Tecnologia e Inteligência
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              A inteligência artificial ajuda a equipe pedagógica a priorizar casos urgentes e sugerir planos de ação.
            </p>
          </div>
        </div>
      </section>

      {/* Callout: Educação & Direitos */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">
            Dúvidas sobre o que é bullying ou quer saber seus direitos?
          </h3>
          <p className="text-xs text-slate-500">
            Conheça a Lei Antibullying (Lei 14.811/24), dicas práticas para testemunhas e como apoiar um amigo.
          </p>
        </div>

        <button
          onClick={onGoToEducation}
          className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          Acessar Guia de Prevenção <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};

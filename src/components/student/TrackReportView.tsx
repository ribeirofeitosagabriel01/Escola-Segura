import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Shield,
  MessageSquare,
  ArrowRight,
  Send,
  AlertCircle,
  HelpCircle,
  School
} from 'lucide-react';
import { BullyingReport, ReportStatus } from '../../types';
import { findReportByTrackingCode, updateReport } from '../../services/storage';

interface TrackReportViewProps {
  initialCode?: string;
  onBackToHome: () => void;
}

const STATUS_STEPS: { key: ReportStatus; label: string; desc: string }[] = [
  {
    key: 'novo',
    label: 'Recebido',
    desc: 'O relato foi recebido pelo sistema com total sigilo.',
  },
  {
    key: 'em_analise',
    label: 'Em Triagem Pedagógica',
    desc: 'A equipe da coordenação e orientação está avaliando as informações.',
  },
  {
    key: 'investigando',
    label: 'Acompanhamento Discreto',
    desc: 'Medidas de observação e averiguação no local reportado estão ativas.',
  },
  {
    key: 'em_acao_pedagogica',
    label: 'Medidas em Execução',
    desc: 'Ações de mediação, palestras ou intervenções com os responsáveis estão em andamento.',
  },
  {
    key: 'resolvido',
    label: 'Concluído / Resolvido',
    desc: 'O caso foi solucionado e o ambiente escolar permanece sob monitoramento.',
  },
];

export const TrackReportView: React.FC<TrackReportViewProps> = ({ initialCode = '', onBackToHome }) => {
  const [code, setCode] = useState(initialCode);
  const [report, setReport] = useState<BullyingReport | null>(
    initialCode ? findReportByTrackingCode(initialCode) || null : null
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialCode));
  const [newReply, setNewReply] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const found = findReportByTrackingCode(code);
    setReport(found || null);
    setHasSearched(true);
  };

  const handleSendAdditionalMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !newReply.trim()) return;

    setIsSendingReply(true);

    const updated: BullyingReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      studentFeedbackMessages: [
        ...report.studentFeedbackMessages,
        {
          id: `stu-${Date.now()}`,
          authorRole: 'Você (Autor da Denúncia)',
          message: newReply.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    updateReport(updated);
    setReport(updated);
    setNewReply('');
    setIsSendingReply(false);
  };

  // Status index for progress bar
  const currentStepIndex = report
    ? STATUS_STEPS.findIndex((s) => s.key === report.status)
    : 0;

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              Acompanhar Minha Denúncia
            </h2>
            <p className="text-xs text-slate-500">
              Digite o código de 4 a 8 caracteres que você recebeu ao enviar o relato (ex: SEG-8419).
            </p>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Digite o código (ex: SEG-8419)"
            className="flex-1 p-2.5 text-sm uppercase font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            Consultar <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Helper quick pills */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400">Códigos de exemplo para testar:</span>
          {['SEG-8419', 'SEG-3912', 'SEG-5120', 'SEG-7043'].map((demoCode) => (
            <button
              key={demoCode}
              type="button"
              onClick={() => {
                setCode(demoCode);
                const found = findReportByTrackingCode(demoCode);
                setReport(found || null);
                setHasSearched(true);
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              {demoCode}
            </button>
          ))}
        </div>
      </div>

      {/* Not Found state */}
      {hasSearched && !report && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="font-bold text-amber-900 text-sm mb-1">
            Nenhuma denúncia encontrada com o código "{code}"
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Verifique se digitou as letras e números corretamente. Nenhum dado é perdido, mas certifique-se de incluir os traços (ex: SEG-8419).
          </p>
        </div>
      )}

      {/* Found Report Details */}
      {report && (
        <div className="space-y-6">
          {/* Progress Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400">Status Atual do Caso</span>
                <h3 className="text-base font-bold text-slate-900">
                  Protocolo: <span className="font-mono text-indigo-600">{report.trackingCode}</span>
                </h3>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span>Registrado em: {new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Step visualization */}
            <div className="space-y-4">
              {STATUS_STEPS.map((s, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={s.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-7 transition-colors ${
                            currentStepIndex > idx ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-indigo-900 font-bold'
                            : isPassed
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label} {isCurrent && <span className="text-[10px] text-indigo-600 font-normal">· Em andamento</span>}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages from Coordination */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Canal de Mensagens Confidenciais com a Escola
            </h3>

            <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
              {report.studentFeedbackMessages && report.studentFeedbackMessages.length > 0 ? (
                report.studentFeedbackMessages.map((msg) => {
                  const isStudent = msg.authorRole.includes('Você');
                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                        isStudent
                          ? 'bg-indigo-50 border border-indigo-100 text-indigo-950 ml-4'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 font-medium">
                        <span className="font-semibold text-slate-700">{msg.authorRole}</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Ainda não há mensagens adicionais registradas. A equipe escolar atualizará em breve.
                </p>
              )}
            </div>

            {/* Send student follow-up reply */}
            <form onSubmit={handleSendAdditionalMessage} className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deseja enviar uma informação adicional ou responder à coordenação?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Escreva sua resposta de forma anônima..."
                  className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newReply.trim() || isSendingReply}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sua resposta continuará 100% anônima e associada apenas ao código {report.trackingCode}.
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

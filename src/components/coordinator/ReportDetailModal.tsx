import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  FileText,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { BullyingReport, ReportStatus, UrgencyLevel } from '../../types';
import { CATEGORY_LABELS } from '../../services/aiTriage';
import { updateReport } from '../../services/storage';

interface ReportDetailModalProps {
  report: BullyingReport;
  onClose: () => void;
  onUpdate: (updated: BullyingReport) => void;
}

const STATUS_OPTIONS: { id: ReportStatus; label: string; color: string }[] = [
  { id: 'novo', label: 'Novo / Recebido', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'em_analise', label: 'Em Triagem Pedagógica', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'investigando', label: 'Em Observação / Investigando', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'em_acao_pedagogica', label: 'Medidas em Execução', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'resolvido', label: 'Resolvido / Concluído', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'arquivado', label: 'Arquivado', color: 'bg-slate-50 text-slate-700 border-slate-200' },
];

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; textClass: string }> = {
  critica: { label: 'Crítica / Risco Imediato', textClass: 'text-rose-700 font-bold' },
  alta: { label: 'Alta Prioridade', textClass: 'text-amber-700 font-semibold' },
  media: { label: 'Média Gravidade', textClass: 'text-yellow-700 font-semibold' },
  baixa: { label: 'Baixa Gravidade', textClass: 'text-slate-600 font-medium' },
};

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onUpdate,
}) => {
  const [currentReport, setCurrentReport] = useState<BullyingReport>(report);
  const [internalNoteText, setInternalNoteText] = useState('');
  const [authorName, setAuthorName] = useState('Coordenação Pedagógica');
  const [authorRole, setAuthorRole] = useState('Orientadora');
  const [studentMessageText, setStudentMessageText] = useState('');
  const [isSendingStudentMsg, setIsSendingStudentMsg] = useState(false);

  const handleStatusChange = (newStatus: ReportStatus) => {
    const updated: BullyingReport = {
      ...currentReport,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    setCurrentReport(updated);
    updateReport(updated);
    onUpdate(updated);
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: authorName.trim() || 'Equipe Pedagógica',
      role: authorRole.trim() || 'Coordenação',
      text: internalNoteText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated: BullyingReport = {
      ...currentReport,
      coordinationNotes: [...currentReport.coordinationNotes, newNote],
      updatedAt: new Date().toISOString(),
    };

    setCurrentReport(updated);
    updateReport(updated);
    onUpdate(updated);
    setInternalNoteText('');
  };

  const handleSendStudentFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentMessageText.trim()) return;

    setIsSendingStudentMsg(true);

    const newMsg = {
      id: `coord-${Date.now()}`,
      authorRole: 'Coordenação e Orientação Pedagógica',
      message: studentMessageText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated: BullyingReport = {
      ...currentReport,
      studentFeedbackMessages: [...currentReport.studentFeedbackMessages, newMsg],
      updatedAt: new Date().toISOString(),
    };

    setCurrentReport(updated);
    updateReport(updated);
    onUpdate(updated);
    setStudentMessageText('');
    setIsSendingStudentMsg(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                {currentReport.id}
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Código: {currentReport.trackingCode}
              </span>
              <span className="text-xs text-slate-500">
                Registrado em {new Date(currentReport.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {CATEGORY_LABELS[currentReport.category]}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Imprimir relatório pedagógico"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Status and Urgency Bar */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Classificação de Gravidade
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${URGENCY_CONFIG[currentReport.urgencyLevel].textClass}`}>
                  {URGENCY_CONFIG[currentReport.urgencyLevel].label}
                </span>
                {currentReport.aiAnalysis?.severityScore && (
                  <span className="text-xs font-mono text-slate-500">
                    (Pontuação: {currentReport.aiAnalysis.severityScore}/10)
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Alterar Status do Caso
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleStatusChange(opt.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      currentReport.status === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Pedagogical Triage Card */}
          {currentReport.aiAnalysis && (
            <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Triagem Inteligente & Recomendações Pedagógicas (IA)
                </div>
                <span className="text-[11px] font-mono text-indigo-700">
                  Modelo Gemini 3.8
                </span>
              </div>

              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                {currentReport.aiAnalysis.riskSummary}
              </p>

              {/* Signals */}
              {currentReport.aiAnalysis.detectedSignals?.length > 0 && (
                <div>
                  <span className="font-semibold text-indigo-900 text-[11px] block mb-1">
                    Fatores Críticos Detectados:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-indigo-900">
                    {currentReport.aiAnalysis.detectedSignals.map((signal, i) => (
                      <li key={i}>{signal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions */}
              {currentReport.aiAnalysis.recommendedActions?.length > 0 && (
                <div className="pt-2 border-t border-indigo-100">
                  <span className="font-semibold text-indigo-900 text-[11px] block mb-1">
                    Ações Pedagógicas Sugeridas para a Coordenação:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-indigo-900">
                    {currentReport.aiAnalysis.recommendedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Incident Narrative */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              Relato Original do Estudante
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Local Reportado:</span>
                <span className="text-slate-800 font-semibold">{currentReport.location}</span>
                {currentReport.specificLocationDetails && (
                  <span className="text-slate-500 block text-[11px]">
                    ({currentReport.specificLocationDetails})
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Período / Recorrência:</span>
                <span className="text-slate-800 font-semibold">{currentReport.timeframe}</span>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Papel do Denunciante:</span>
                <span className="text-slate-800 font-semibold capitalize">
                  {currentReport.reporterRole === 'vitima' ? 'A própria vítima' : currentReport.reporterRole}
                </span>
                {currentReport.targetClassGrade && (
                  <span className="text-slate-500 block text-[11px]">
                    Turma: {currentReport.targetClassGrade}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">
                Descrição dos Fatos:
              </span>
              <p className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {currentReport.description}
              </p>
            </div>

            {currentReport.involvedPeople && (
              <div className="border border-amber-200/80 rounded-lg p-3.5 bg-amber-50/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-500 uppercase text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Pessoas Citadas ou Características
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    Restrito à Coordenação
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-amber-200/60 text-slate-900 font-medium text-xs">
                  {currentReport.involvedPeople}
                </div>
              </div>
            )}

            {currentReport.hasEvidenceAttached && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                <strong>O aluno sinalizou possuir evidências guardadas (prints ou fotos):</strong>
                {currentReport.evidenceNotes && <p className="mt-0.5">"{currentReport.evidenceNotes}"</p>}
              </div>
            )}
          </div>

          {/* Anonymous Messaging to Student */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Retorno Anônimo para o Aluno (Visível pelo Código {currentReport.trackingCode})
            </h3>
            <p className="text-slate-500 text-xs">
              Escreva orientações, palavras de acolhimento ou o aviso de que o caso está sendo resolvido. O aluno lerá quando consultar seu código secreto.
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentReport.studentFeedbackMessages?.map((msg) => (
                <div key={msg.id} className="p-3 rounded bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-slate-700">{msg.authorRole}</span>
                    <span>{new Date(msg.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-slate-800">{msg.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendStudentFeedback} className="flex gap-2 pt-2">
              <input
                type="text"
                value={studentMessageText}
                onChange={(e) => setStudentMessageText(e.target.value)}
                placeholder="Escreva uma mensagem acolhedora de retorno para o aluno..."
                className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!studentMessageText.trim() || isSendingStudentMsg}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Enviar Retorno
              </button>
            </form>
          </div>

          {/* Internal Pedagogical Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              Anotações Internas & Sigilosas da Equipe Escolar
            </h3>
            <p className="text-slate-500 text-xs">
              Estas notas são restritas aos professores, coordenação e direção. Não são visíveis para os estudantes.
            </p>

            <div className="space-y-2">
              {currentReport.coordinationNotes?.length > 0 ? (
                currentReport.coordinationNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded bg-amber-50/40 border border-amber-200/60 text-xs">
                    <div className="flex justify-between text-[10px] text-amber-900 font-semibold mb-1">
                      <span>{note.author} · {note.role}</span>
                      <span>{new Date(note.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-slate-800">{note.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Nenhuma anotação interna registrada ainda.</p>
              )}
            </div>

            <form onSubmit={handleAddInternalNote} className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Seu nome (ex: Profª Márcia)"
                  className="w-1/3 p-2 text-xs rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Cargo (ex: Orientadora Pedagógica)"
                  className="w-1/3 p-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Descreva o procedimento adotado (ex: Reunião com responsáveis agendada, monitor de pátio orientado...)"
                  className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!internalNoteText.trim()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Salvar Nota
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dados protegidos pela LGPD e protocolos escolares de privacidade.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-medium text-slate-700 cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};

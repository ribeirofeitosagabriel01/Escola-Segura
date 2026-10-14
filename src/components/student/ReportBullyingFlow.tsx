import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  Send,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageSquare,
  Lock,
  Sparkles,
  Users
} from 'lucide-react';
import { BullyingCategory, ReporterRole, BullyingReport } from '../../types';
import { runAiTriage, CATEGORY_LABELS } from '../../services/aiTriage';
import { generateReportId, generateTrackingCode, saveNewReport } from '../../services/storage';

interface ReportBullyingFlowProps {
  onSuccess: (newReport: BullyingReport) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS: { id: BullyingCategory; title: string; description: string; icon: string }[] = [
  {
    id: 'verbal',
    title: 'Bullying Verbal',
    description: 'Apelidos ofensivos, humilhações, piadas maldosas ou xingamentos repetitivos.',
    icon: '🗣️'
  },
  {
    id: 'cyberbullying',
    title: 'Cyberbullying / Virtual',
    description: 'Mensagens em redes sociais, figurinhas humilhantes, WhatsApp, prints expostos.',
    icon: '📱'
  },
  {
    id: 'fisico',
    title: 'Agressão Física',
    description: 'Empurrões, socos, tropeções intencionais, chutes ou ameaças de bater.',
    icon: '⚠️'
  },
  {
    id: 'psicologico',
    title: 'Intimidação / Psicológico',
    description: 'Ameaças veladas, perseguição, chantagens ou olhares intimidadores.',
    icon: '🧠'
  },
  {
    id: 'exclusao',
    title: 'Exclusão Social / Isolamento',
    description: 'Ser deixado de fora de grupos, fofocas deliberadas, ninguém sentar junto.',
    icon: '👥'
  },
  {
    id: 'material',
    title: 'Danos a Materiais ou Roubo',
    description: 'Estragar cadernos, esconder estojo, rasgar uniforme ou tomar lanche.',
    icon: '🎒'
  },
  {
    id: 'outro',
    title: 'Outro Tipo de Agressão',
    description: 'Qualquer outra atitude que cause medo, tristeza ou humilhação.',
    icon: '📝'
  }
];

const LOCATION_OPTIONS = [
  'Sala de Aula',
  'Pátio / Recreio',
  'Banheiros',
  'Corredores',
  'Redes Sociais / Internet / WhatsApp',
  'Entrada / Saída da Escola',
  'Quadra de Esportes',
  'Transporte Escolar (Ônibus / Van)',
  'Arredores da Escola',
  'Outro Local'
];

const TIMEFRAME_OPTIONS = [
  'Aconteceu hoje',
  'Esta semana',
  'Várias vezes recentemente (recorrente)',
  'Há mais de um mês (persistente)'
];

export const ReportBullyingFlow: React.FC<ReportBullyingFlowProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [category, setCategory] = useState<BullyingCategory>('verbal');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]);
  const [specificLocation, setSpecificLocation] = useState('');
  const [timeframe, setTimeframe] = useState(TIMEFRAME_OPTIONS[0]);
  const [reporterRole, setReporterRole] = useState<ReporterRole>('vitima');
  const [targetClassGrade, setTargetClassGrade] = useState('');
  const [involvedPeople, setInvolvedPeople] = useState('');
  const [hasEvidence, setHasEvidence] = useState(false);
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<BullyingReport | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Por favor, descreva brevemente o que aconteceu para que a coordenação possa entender.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Run AI Triage & Empathetic Analysis
      const aiAnalysis = await runAiTriage(
        category,
        location,
        timeframe,
        description,
        involvedPeople
      );

      // 2. Build Report Record
      const newReport: BullyingReport = {
        id: generateReportId(),
        trackingCode: generateTrackingCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category,
        location,
        specificLocationDetails: specificLocation.trim() || undefined,
        timeframe,
        reporterRole,
        targetClassGrade: targetClassGrade.trim() || undefined,
        description: description.trim(),
        involvedPeople: involvedPeople.trim() || undefined,
        hasEvidenceAttached: hasEvidence,
        evidenceNotes: evidenceNotes.trim() || undefined,
        urgencyLevel: aiAnalysis.urgencyLevel,
        status: 'novo',
        aiAnalysis,
        coordinationNotes: [],
        studentFeedbackMessages: [
          {
            id: 'welcome-msg',
            authorRole: 'Sistema de Acolhimento Escolar',
            message: 'Seu relato foi recebido de forma 100% anônima e atribuído à equipe pedagógica. Acompanhe as respostas por este código.',
            createdAt: new Date().toISOString(),
          }
        ]
      };

      // 3. Save report
      saveNewReport(newReport);
      setSubmittedReport(newReport);
    } catch (err) {
      console.error('Falha ao processar denúncia:', err);
      alert('Houve uma falha ao enviar o relato. Por favor tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!submittedReport) return;
    navigator.clipboard.writeText(submittedReport.trackingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // SUCCESS / POST-SUBMISSION SCREEN
  if (submittedReport) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto my-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-1">
          Denúncia Registrada com Sucesso
        </h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          Seu anonimato está 100% garantido. A coordenação e a orientação pedagógica já foram notificadas.
        </p>

        {/* Tracking Code Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-center">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block mb-1">
            Seu Código de Acompanhamento Anônimo
          </span>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-700 tracking-wider">
              {submittedReport.trackingCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded border border-slate-200 transition-colors cursor-pointer"
              title="Copiar código"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Anote ou guarde este código. Com ele, você poderá ver o andamento do caso e mensagens carinhosas de retorno da coordenação sem nunca revelar quem você é.
          </p>
        </div>

        {/* AI Empathetic Message */}
        {submittedReport.aiAnalysis?.supportMessageForStudent && (
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                Mensagem de Acolhimento Imediato
              </span>
            </div>
            <p className="text-sm text-indigo-950 leading-relaxed">
              "{submittedReport.aiAnalysis.supportMessageForStudent}"
            </p>
          </div>
        )}

        {/* Immediate Resources for Student */}
        <div className="border-t border-slate-100 pt-5 mb-6 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800">Canais de Apoio Imediato e Seguro:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-medium text-slate-900 block">📞 CVV - Apoio Emocional</span>
              <span className="text-slate-500">Ligue 188 (gratuito, 24 horas)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-medium text-slate-900 block">🛡️ Sala de Orientação da Escola</span>
              <span className="text-slate-500">Espaço de escuta confidencial sem julgamentos</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => onSuccess(submittedReport)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            Acompanhar Esta Denúncia Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto my-6 overflow-hidden">
      {/* Header & Steps */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Denunciar Bullying · Canal Seguro e Anônimo
            </h2>
            <p className="text-xs text-slate-500">
              Sua identidade não será solicitada nem armazenada.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium"
          >
            Cancelar
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {[
            { num: 1, label: 'O que aconteceu' },
            { num: 2, label: 'Onde e quando' },
            { num: 3, label: 'Informações' },
            { num: 4, label: 'Confirmar' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex flex-col items-center sm:items-start">
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  step >= s.num ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
              <span className="text-[11px] text-slate-500 mt-1 hidden sm:inline">
                {s.num}. {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* STEP 1: CATEGORY & DESCRIPTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                1. Qual tipo de comportamento aconteceu?
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Selecione a opção que melhor se aproxima do que você viveu ou presenciou.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORY_OPTIONS.map((item) => {
                  const isSelected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                2. Escreva com calma o que aconteceu <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Conte os detalhes com suas próprias palavras: o que foi dito ou feito, como você se sentiu e por que isso te incomodou.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exemplo: Durante o recreio, um grupo me cercou e começou a rir, dizendo coisas humilhantes sobre minha roupa... ou: Estão espalhando montagens minhas no grupo de WhatsApp..."
                rows={4}
                required
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!description.trim()}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Avançar: Local e Data <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & TIMEFRAME */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                3. Onde isso aconteceu?
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Identificar o local ajuda a escola a reforçar a supervisão e proteger o ambiente.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LOCATION_OPTIONS.map((loc) => {
                  const isSelected = location === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`p-2.5 rounded-lg text-xs font-medium border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{loc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  placeholder="Detalhe específico (ex: Sala 12, Perto da cantina, Grupo de WhatsApp da turma, etc.) - opcional"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                4. Quando isso aconteceu?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {TIMEFRAME_OPTIONS.map((time) => {
                  const isSelected = timeframe === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimeframe(time)}
                      className={`p-3 rounded-lg text-xs font-medium border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Avançar: Informações <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COMPLEMENTARY INFO */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                5. Você é a vítima ou testemunha?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {[
                  { role: 'vitima' as ReporterRole, label: 'Eu sou a vítima' },
                  { role: 'testemunha' as ReporterRole, label: 'Eu vi acontecer' },
                  { role: 'amigo' as ReporterRole, label: 'Amigo(a) da vítima' },
                  { role: 'responsavel' as ReporterRole, label: 'Responsável' }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setReporterRole(item.role)}
                    className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      reporterRole === item.role
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                6. Série ou Turma Envolvida (Opcional)
              </label>
              <input
                type="text"
                value={targetClassGrade}
                onChange={(e) => setTargetClassGrade(e.target.value)}
                placeholder="Exemplo: 8º Ano B, 7º Ano A, 1º Ano Ensino Médio..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                7. Pessoas envolvidas (Opcional & Confidencial)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Se souber os nomes, apelidos ou características de quem praticou ou presenciou, pode informar aqui. A escola usará isso apenas para averiguação discreta.
              </p>
              <input
                type="text"
                value={involvedPeople}
                onChange={(e) => setInvolvedPeople(e.target.value)}
                placeholder="Exemplo: Dois alunos do 9º ano que usam moletom azul... (opcional)"
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasEvidence}
                  onChange={(e) => setHasEvidence(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Tenho prints, fotos, bilhetes ou evidências salvas no meu telefone
              </label>
              {hasEvidence && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    placeholder="Descreva brevemente que tipo de evidência você tem (ex: prints das ofensas no WhatsApp)"
                    className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Guarde essas evidências em segurança. A coordenação pode pedir para visualizá-las apenas se você desejar.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Avançar: Revisão Final <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                Resumo da Sua Denúncia
              </h3>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Tipo de Situação:</span>
                <span className="text-slate-800 font-medium">{CATEGORY_LABELS[category]}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Local e Horário:</span>
                <span className="text-slate-800 font-medium">
                  {location} {specificLocation ? `(${specificLocation})` : ''} · {timeframe}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">O que aconteceu:</span>
                <p className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200 mt-1">
                  "{description}"
                </p>
              </div>

              {involvedPeople && (
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Pessoas citadas:</span>
                  <span className="text-slate-800">{involvedPeople}</span>
                </div>
              )}
            </div>

            {/* Anonymity Pledge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 leading-relaxed">
                <strong className="font-semibold block mb-0.5">Garantia Absoluta de Anonimato:</strong>
                Ao clicar em Enviar, seu relato é codificado. Nenhum professor, aluno ou coordenador saberá de qual aparelho ou usuário a mensagem partiu. Você receberá um código único para poder acompanhar os passos tomados pela escola.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Processando com Segurança...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Denúncia Anônima
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

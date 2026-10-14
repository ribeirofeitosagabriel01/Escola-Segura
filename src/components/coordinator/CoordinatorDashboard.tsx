import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  Inbox,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { BullyingReport, ReportStatus, UrgencyLevel, BullyingCategory } from '../../types';
import { CATEGORY_LABELS } from '../../services/aiTriage';
import { computeSchoolStats, resetToSeedReports } from '../../services/storage';
import { ReportDetailModal } from './ReportDetailModal';

interface CoordinatorDashboardProps {
  reports: BullyingReport[];
  onReportsChange: (updatedList: BullyingReport[]) => void;
  onLogout: () => void;
}

const STATUS_FILTER_LABELS: { key: string; label: string }[] = [
  { key: 'all', label: 'Todas as Denúncias' },
  { key: 'novo', label: 'Novos' },
  { key: 'em_analise', label: 'Em Triagem' },
  { key: 'investigando', label: 'Em Observação' },
  { key: 'em_acao_pedagogica', label: 'Medidas em Ação' },
  { key: 'resolvido', label: 'Resolvidos' },
];

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  reports,
  onReportsChange,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeReport, setActiveReport] = useState<BullyingReport | null>(null);
  const [isMaskNamesActive, setIsMaskNamesActive] = useState<boolean>(false);

  const stats = computeSchoolStats(reports);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedUrgency !== 'all' && r.urgencyLevel !== selectedUrgency) return false;
    if (selectedLocation !== 'all' && r.location !== selectedLocation) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.trackingCode.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.targetClassGrade && r.targetClassGrade.toLowerCase().includes(q)) ||
        (r.involvedPeople && r.involvedPeople.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleResetData = () => {
    if (confirm('Deseja recarregar os dados de exemplo pré-configurados do sistema?')) {
      const seeded = resetToSeedReports();
      onReportsChange(seeded);
    }
  };

  const handleUpdateReport = (updated: BullyingReport) => {
    const nextList = reports.map((r) => (r.id === updated.id ? updated : r));
    onReportsChange(nextList);
    setActiveReport(updated);
  };

  const uniqueLocations = Array.from(new Set(reports.map((r) => r.location)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Active Session & Confidentiality Alert Bar */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Ambiente Restrito Autenticado
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-semibold">
                Sigilo Ativo
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Sessão autorizada: Coordenação Pedagógica / Direção. Acesso exclusivo e confidencial.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsMaskNamesActive(!isMaskNamesActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isMaskNamesActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Oculta detalhes textuais sensíveis para exibição em conselho ou projetor"
          >
            {isMaskNamesActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isMaskNamesActive ? 'Modo Apresentação: Ativo' : 'Ocultar Detalhes'}</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Encerrar sessão e bloquear o painel imediatamente"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bloquear / Sair</span>
          </button>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
            Painel da Coordenação & Direção Escolar
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            Gestão de Ocorrências e Triagem Pedagógica
          </h1>
          <p className="text-xs text-slate-500">
            Ambiente reservado para orientadores e gestores escolares agirem com confidencialidade e acolhimento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Recarrega as denúncias de exemplo pré-configuradas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Dados Demo
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Total de Relatos</span>
            <Inbox className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalReports}</div>
          <span className="text-[11px] text-slate-500">Casos registrados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-blue-500 text-xs mb-1">
            <span className="font-medium text-slate-700">Novos Recebidos</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.newReports}</div>
          <span className="text-[11px] text-blue-600">Aguardando leitura</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-500 text-xs mb-1">
            <span className="font-medium text-slate-700">Em Acompanhamento</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{stats.inProgress}</div>
          <span className="text-[11px] text-amber-600">Observação / Mediação</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-500 text-xs mb-1">
            <span className="font-medium text-slate-700">Alertas Críticos</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{stats.criticalCases}</div>
          <span className="text-[11px] text-rose-600">Atenção imediata</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-500 text-xs mb-1">
            <span className="font-medium text-slate-700">Resolvidos</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{stats.resolved}</div>
          <span className="text-[11px] text-emerald-600">
            {stats.totalReports > 0
              ? `${Math.round((stats.resolved / stats.totalReports) * 100)}% resolvidos`
              : '0%'}
          </span>
        </div>
      </div>

      {/* Hotspots & Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hotspots */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Locais com Mais Ocorrências (Pontos de Atenção)
            </h3>
            <span className="text-[11px] text-slate-400">Guia de rondas</span>
          </div>

          <div className="space-y-2.5">
            {stats.locationBreakdown.slice(0, 5).map((loc) => (
              <div key={loc.location} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{loc.location}</span>
                  <span className="text-slate-500 font-mono">
                    {loc.count} ({loc.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${Math.max(loc.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Tipos Mais Frequentes de Comportamento
            </h3>
            <span className="text-[11px] text-slate-400">Para planejamento da BNCC</span>
          </div>

          <div className="space-y-2.5">
            {stats.categoryBreakdown.slice(0, 5).map((cat) => {
              const pct = stats.totalReports > 0 ? Math.round((cat.count / stats.totalReports) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat.label}</span>
                    <span className="text-slate-500 font-mono">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (ex: SEG-8419), palavra-chave, turma ou local..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="all">Todas as Gravidades</option>
            <option value="critica">Crítica (Urgência)</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="all">Todos os Locais</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {STATUS_FILTER_LABELS.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedStatus(item.key)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === item.key
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Mostrando {filteredReports.length} de {reports.length} denúncias</span>
          <span>Clique em um caso para abrir a análise e o plano de ação</span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma denúncia encontrada</p>
            <p className="text-xs mt-1">Ajuste os filtros de busca ou limpe os termos pesquisados.</p>
          </div>
        ) : (
          filteredReports.map((item) => {
            const isCritical = item.urgencyLevel === 'critica';
            const isHigh = item.urgencyLevel === 'alta';

            return (
              <div
                key={item.id}
                onClick={() => setActiveReport(item)}
                className={`bg-white rounded-xl border p-4 sm:p-5 transition-all hover:shadow-md cursor-pointer ${
                  isCritical
                    ? 'border-rose-300 hover:border-rose-400 bg-rose-50/10'
                    : isHigh
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {item.trackingCode}
                    </span>

                    {/* Unboxed clean metadata (Zero-pill discipline) */}
                    <span className="text-xs text-slate-500">
                      {item.location}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-500">
                      {item.timeframe}
                    </span>
                    {item.targetClassGrade && (
                      <>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.targetClassGrade}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        isCritical
                          ? 'text-rose-700'
                          : isHigh
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      Gravidade: {item.urgencyLevel.toUpperCase()}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">|</span>
                    <span className="text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Title & Preview */}
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {CATEGORY_LABELS[item.category]}
                </h3>
                <p className={`text-xs leading-relaxed mb-3 ${isMaskNamesActive ? 'text-slate-400 italic font-mono select-none' : 'text-slate-600 line-clamp-2'}`}>
                  {isMaskNamesActive ? '•••••••• [Texto do relato protegido em Modo Apresentação] ••••••••' : `"${item.description}"`}
                </p>

                {/* Bottom indicators */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="font-medium text-slate-700">
                      Status: <strong className="text-indigo-700">{item.status.replace('_', ' ').toUpperCase()}</strong>
                    </span>

                    {item.aiAnalysis && (
                      <span className="flex items-center gap-1 text-indigo-600">
                        <Sparkles className="w-3.5 h-3.5" />
                        Triado por IA ({item.aiAnalysis.severityScore}/10)
                      </span>
                    )}

                    {item.studentFeedbackMessages?.length > 1 && (
                      <span className="text-slate-500">
                        💬 {item.studentFeedbackMessages.length} mensagens
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
                    Abrir Caso <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {activeReport && (
        <ReportDetailModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onUpdate={handleUpdateReport}
        />
      )}
    </div>
  );
};

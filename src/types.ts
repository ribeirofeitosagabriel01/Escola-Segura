export type BullyingCategory =
  | 'verbal'
  | 'fisico'
  | 'psicologico'
  | 'cyberbullying'
  | 'exclusao'
  | 'material'
  | 'outro';

export type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'critica';

export type ReportStatus =
  | 'novo'
  | 'em_analise'
  | 'investigando'
  | 'em_acao_pedagogica'
  | 'resolvido'
  | 'arquivado';

export type ReporterRole = 'vitima' | 'testemunha' | 'amigo' | 'responsavel';

export interface AiTriageAnalysis {
  severityScore: number; // 1 to 10
  urgencyLevel: UrgencyLevel;
  detectedSignals: string[];
  recommendedActions: string[];
  supportMessageForStudent: string;
  riskSummary: string;
  suggestedSchoolProtocols: string[];
}

export interface CoordinationNote {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

export interface StudentFeedbackMessage {
  id: string;
  authorRole: string; // ex: 'Coordenação Pedagógica' ou 'Orientadora Educacional'
  message: string;
  createdAt: string;
}

export interface BullyingReport {
  id: string;
  trackingCode: string; // ex: SEG-7291
  createdAt: string;
  updatedAt: string;
  category: BullyingCategory;
  location: string;
  specificLocationDetails?: string;
  timeframe: string;
  reporterRole: ReporterRole;
  targetClassGrade?: string;
  description: string;
  involvedPeople?: string;
  hasEvidenceAttached?: boolean;
  evidenceNotes?: string;
  urgencyLevel: UrgencyLevel;
  status: ReportStatus;
  aiAnalysis?: AiTriageAnalysis;
  coordinationNotes: CoordinationNote[];
  studentFeedbackMessages: StudentFeedbackMessage[];
}

export interface SchoolStats {
  totalReports: number;
  newReports: number;
  inProgress: number;
  resolved: number;
  criticalCases: number;
  locationBreakdown: { location: string; count: number; percentage: number }[];
  categoryBreakdown: { category: BullyingCategory; count: number; label: string }[];
}

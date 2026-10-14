import { BullyingReport, SchoolStats, ReportStatus, UrgencyLevel, BullyingCategory } from '../types';
import { analyzeWithLocalEngine } from './aiTriage';

const STORAGE_KEY = 'escola_segura_bullying_reports_v1';

const INITIAL_SEED_REPORTS: BullyingReport[] = [
  {
    id: 'DEN-2026-081',
    trackingCode: 'SEG-8419',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: 'cyberbullying',
    location: 'Redes Sociais / Internet / WhatsApp',
    specificLocationDetails: 'Grupo de WhatsApp da turma do 8º Ano B',
    timeframe: 'Esta semana',
    reporterRole: 'vitima',
    targetClassGrade: '8º Ano B',
    description: 'Criaram figurinhas zombando da minha aparência física e fotos tiradas sem minha autorização na aula de educação física, e estão espalhando no grupo da sala.',
    involvedPeople: '3 colegas da sala que administram o grupo',
    hasEvidenceAttached: true,
    evidenceNotes: 'Tenho os prints salvos no celular se precisarem',
    urgencyLevel: 'alta',
    status: 'em_analise',
    aiAnalysis: {
      severityScore: 7,
      urgencyLevel: 'alta',
      detectedSignals: [
        'Disseminação digital não autorizada de imagem',
        'Humilhação pública no grupo da turma',
        'Cyberbullying com impacto na autoestima'
      ],
      recommendedActions: [
        'Intervenção com os responsáveis pelos administradores do grupo',
        'Ação pedagógica emergencial sobre Lei 14.811/24 e cyberbullying na turma',
        'Acolhimento discreto da vítima na sala de orientação'
      ],
      supportMessageForStudent: 'Você foi muito corajoso(a) ao relatar. Nenhum aluno tem o direito de tirar fotos suas ou criar figurinhas pejorativas. A escola está cuidando disso com sigilo absoluto.',
      riskSummary: 'Cyberbullying ativo no 8º Ano B com circulação de imagens não autorizadas. Risco de isolamento da vítima.',
      suggestedSchoolProtocols: ['Protocolo Anti-Cyberbullying Escolar', 'Código de Convivência Digital']
    },
    coordinationNotes: [
      {
        id: 'note-1',
        author: 'Profª Márcia Andrade',
        role: 'Coordenadora do Ensino Fundamental II',
        text: 'Conversei reservadamente com o professor de Ed. Física para alertar sobre o uso de celulares nas aulas. Próximo passo: convocar os representantes de turma para alinhamento geral.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      }
    ],
    studentFeedbackMessages: [
      {
        id: 'msg-1',
        authorRole: 'Coordenação Pedagógica',
        message: 'Olá! Recebemos seu relato e já estamos atuando de forma confidencial. Não precisa ter medo de frequentar a escola. Se quiser conversar pessoalmente com a orientadora Márcia em um momento reservado, nossa porta está aberta.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      }
    ]
  },
  {
    id: 'DEN-2026-079',
    trackingCode: 'SEG-3912',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Ontem
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    category: 'verbal',
    location: 'Pátio / Recreio',
    specificLocationDetails: 'Perto dos bancos do Bloco C, durante o intervalo do lanche',
    timeframe: 'Várias vezes recentemente',
    reporterRole: 'testemunha',
    targetClassGrade: '7º Ano A',
    description: 'Um grupo de três meninos fica chamando um colega novato de apelidos humilhantes todos os dias quando ele tenta sentar para comer. O colega fica chorando sozinho no canto.',
    involvedPeople: 'Alunos do 7º Ano que costumam ficar na quadra',
    hasEvidenceAttached: false,
    urgencyLevel: 'media',
    status: 'investigando',
    aiAnalysis: {
      severityScore: 6,
      urgencyLevel: 'media',
      detectedSignals: [
        'Comportamento repetitivo e direcionado a aluno recém-chegado',
        'Humilhação pública no refeitório/pátio',
        'Denúncia feita por testemunha solidária'
      ],
      recommendedActions: [
        'Aumentar presença de monitores de pátio na área dos bancos do Bloco C',
        'Promover dinâmica de integração de alunos novatos',
        'Abordagem pedagógica reflexiva sem expor quem denunciou'
      ],
      supportMessageForStudent: 'Obrigado por não ser um espectador passivo! Proteger os colegas fortalece toda a nossa escola. Sua denúncia ajuda a manter nossa comunidade segura.',
      riskSummary: 'Intimidação verbal crônica no pátio com isolamento de aluno novato.',
      suggestedSchoolProtocols: ['Vigilância Ativa de Intervalo', 'Programa Aluno Acolhedor']
    },
    coordinationNotes: [
      {
        id: 'note-2',
        author: 'Roberto Silveira',
        role: 'Inspetor Chefe de Pátio',
        text: 'Posto fixo de monitoria alocado próximo ao Bloco C das 10h15 às 10h45.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      }
    ],
    studentFeedbackMessages: [
      {
        id: 'msg-2',
        authorRole: 'Direção Escolar',
        message: 'Agradecemos muito sua solidariedade. Os monitores já reforçaram a observação do pátio no Bloco C e medidas protetivas estão sendo adotadas.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      }
    ]
  },
  {
    id: 'DEN-2026-074',
    trackingCode: 'SEG-5120',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 dias atrás
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: 'fisico',
    location: 'Banheiros',
    specificLocationDetails: 'Banheiro masculino do 1º andar',
    timeframe: 'Esta semana',
    reporterRole: 'vitima',
    targetClassGrade: '9º Ano C',
    description: 'Dois alunos me encurralaram na saída do banheiro, deram empurrões contra a parede e disseram que se eu contasse para alguém iam me bater do lado de fora da escola.',
    involvedPeople: 'Alunos mais velhos do 9º C',
    hasEvidenceAttached: false,
    urgencyLevel: 'critica',
    status: 'em_acao_pedagogica',
    aiAnalysis: {
      severityScore: 9,
      urgencyLevel: 'critica',
      detectedSignals: [
        'Agressão física e encurralamento em local sem câmeras',
        'Ameaça direta de agressão extramuros',
        'Risco imediato à integridade do aluno'
      ],
      recommendedActions: [
        'Acolhimento de urgência com a direção e contato com os responsáveis das duas partes',
        'Acompanhamento do aluno nos horários de entrada e saída da escola',
        'Reunião com Conselho Tutelar se a reincidência persistir'
      ],
      supportMessageForStudent: 'Você está protegido(a). A direção da escola não tolera nenhuma ameaça ou violência física. Providências imediatas foram tomadas com a coordenação.',
      riskSummary: 'Ameaça física com coação grave no banheiro. Gravidade máxima.',
      suggestedSchoolProtocols: ['Protocolo Emergencial de Violência Física', 'Escolta e Segurança de Saída']
    },
    coordinationNotes: [
      {
        id: 'note-3',
        author: 'Diretor Carlos Mendes',
        role: 'Diretor Geral',
        text: 'Famílias notificadas para reunião de mediação restaurativa. Apoio psicológico agendado para o aluno na sexta-feira.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      }
    ],
    studentFeedbackMessages: [
      {
        id: 'msg-3',
        authorRole: 'Direção Geral',
        message: 'Caso priorizado em nível máximo de segurança. Você está seguro e não haverá retaliações.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      }
    ]
  },
  {
    id: 'DEN-2026-068',
    trackingCode: 'SEG-7043',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: 'exclusao',
    location: 'Sala de Aula',
    specificLocationDetails: 'Sala 14, aulas com trabalhos em grupo',
    timeframe: 'Há mais de um mês',
    reporterRole: 'vitima',
    targetClassGrade: '1º Ano EM',
    description: 'Ninguém me deixa participar de nenhum trabalho. Quando o professor pede pra formar duplas, todos se recusam a fazer comigo e riem quando fico sozinho na carteira.',
    involvedPeople: 'Maioria da sala',
    hasEvidenceAttached: false,
    urgencyLevel: 'media',
    status: 'resolvido',
    aiAnalysis: {
      severityScore: 5,
      urgencyLevel: 'media',
      detectedSignals: [
        'Isolamento forçado crônico em ambiente de aprendizagem',
        'Erosão da autoestima e sentimento de rejeição'
      ],
      recommendedActions: [
        'Orientar professores a sortear grupos pedagogicamente sem exposição',
        'Trabalhar empatia e pertencimento comunitário'
      ],
      supportMessageForStudent: 'Estar em um grupo escolar deve ser um acolhimento, não uma dor. Nossos professores foram orientados a mudar a metodologia de formação de equipes.',
      riskSummary: 'Exclusão social crônica em sala de aula.',
      suggestedSchoolProtocols: ['Metodologia de Aprendizagem Cooperativa']
    },
    coordinationNotes: [
      {
        id: 'note-4',
        author: 'Profª Helena Reis',
        role: 'Orientadora Educacional',
        text: 'Realizada reunião com os docentes da turma. Adotada a prática de grupos sorteados e projetos com papéis rotativos. Aluno relatou melhora significativa na integração.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      }
    ],
    studentFeedbackMessages: [
      {
        id: 'msg-4',
        authorRole: 'Orientadora Educacional',
        message: 'Caso acompanhado com sucesso. Continuamos com os olhos abertos para que sua sala seja um lugar agradável e de respeito para você!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      }
    ]
  }
];

export function getStoredReports(): BullyingReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
      return INITIAL_SEED_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
      return INITIAL_SEED_REPORTS;
    }
    return parsed;
  } catch (err) {
    console.error('Erro ao ler denúncias do localStorage:', err);
    return INITIAL_SEED_REPORTS;
  }
}

export function saveNewReport(report: BullyingReport): void {
  const current = getStoredReports();
  const updated = [report, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateReport(updatedReport: BullyingReport): void {
  const current = getStoredReports();
  const next = current.map((r) => (r.id === updatedReport.id ? updatedReport : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function deleteReport(id: string): void {
  const current = getStoredReports();
  const next = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function resetToSeedReports(): BullyingReport[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
  return INITIAL_SEED_REPORTS;
}

export function findReportByTrackingCode(code: string): BullyingReport | undefined {
  const cleaned = code.trim().toUpperCase();
  const reports = getStoredReports();
  return reports.find(
    (r) => r.trackingCode.toUpperCase() === cleaned || r.id.toUpperCase() === cleaned
  );
}

export function generateTrackingCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SEG-${num}`;
}

export function generateReportId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  return `DEN-${year}-${rand}`;
}

export function computeSchoolStats(reports: BullyingReport[]): SchoolStats {
  const total = reports.length;
  const newReports = reports.filter((r) => r.status === 'novo').length;
  const inProgress = reports.filter((r) => ['em_analise', 'investigando', 'em_acao_pedagogica'].includes(r.status)).length;
  const resolved = reports.filter((r) => r.status === 'resolvido').length;
  const criticalCases = reports.filter((r) => r.urgencyLevel === 'critica' && r.status !== 'resolvido').length;

  const locCount: Record<string, number> = {};
  const catCount: Record<BullyingCategory, number> = {
    verbal: 0,
    fisico: 0,
    psicologico: 0,
    cyberbullying: 0,
    exclusao: 0,
    material: 0,
    outro: 0,
  };

  reports.forEach((r) => {
    locCount[r.location] = (locCount[r.location] || 0) + 1;
    if (catCount[r.category] !== undefined) {
      catCount[r.category]++;
    } else {
      catCount['outro'] = (catCount['outro'] || 0) + 1;
    }
  });

  const locationBreakdown = Object.entries(locCount)
    .map(([location, count]) => ({
      location,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const categoryLabels: Record<BullyingCategory, string> = {
    verbal: 'Verbal / Apelidos',
    fisico: 'Físico / Agressão',
    psicologico: 'Psicológico / Ameaça',
    cyberbullying: 'Cyberbullying / WhatsApp',
    exclusao: 'Exclusão Social',
    material: 'Danos Materiais',
    outro: 'Outros',
  };

  const categoryBreakdown = (Object.keys(catCount) as BullyingCategory[])
    .map((category) => ({
      category,
      count: catCount[category],
      label: categoryLabels[category],
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    totalReports: total,
    newReports,
    inProgress,
    resolved,
    criticalCases,
    locationBreakdown,
    categoryBreakdown,
  };
}

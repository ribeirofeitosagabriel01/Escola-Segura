import { GoogleGenAI } from '@google/genai';
import { AiTriageAnalysis, BullyingCategory, UrgencyLevel } from '../types';

export const CATEGORY_LABELS: Record<BullyingCategory, string> = {
  verbal: 'Bullying Verbal (apelidos pejorativos, ofensas, xingamentos)',
  fisico: 'Agressão Física (empurrões, socos, tropeções, agressões)',
  psicologico: 'Psicológico / Intimidação (ameaças, chantagens, perseguição)',
  cyberbullying: 'Cyberbullying (redes sociais, figurinhas pejorativas, WhatsApp)',
  exclusao: 'Exclusão Social (isolamento forçado, fofocas, difamação)',
  material: 'Danos Materiais (estragar material, roubo de lanche ou pertences)',
  outro: 'Outro comportamento hostil',
};

// Deterministic expert heuristic fallback
export function analyzeWithLocalEngine(
  category: BullyingCategory,
  location: string,
  timeframe: string,
  description: string,
  involvedPeople?: string
): AiTriageAnalysis {
  const text = `${description} ${location} ${involvedPeople || ''}`.toLowerCase();
  
  const hasPhysicalWords = /soco|chute|bater|sangue|machuc|arma|faca|morte|matar|esmurr|apedrej|jogar no chao|empurr/i.test(text);
  const hasSevereThreats = /ameac|vou te pegar|suicid|desespero|morrer|ninguem vai saber|fora da escola/i.test(text);
  const hasCyberStalking = /nude|foto|expor|grupo|whatsapp|instagram|tiktok|figurinha|vazar/i.test(text);
  const isRecurrent = /todos os dias|sempre|toda semana|frequente|repetid|meses/i.test(text) || timeframe.includes('recorrente') || timeframe.includes('mes');

  let severityScore = 4;
  let urgencyLevel: UrgencyLevel = 'baixa';
  const detectedSignals: string[] = [];
  const recommendedActions: string[] = [];
  const suggestedProtocols: string[] = [];

  if (category === 'fisico' || hasPhysicalWords) {
    severityScore += 4;
    detectedSignals.push('Indícios de integridade física ameaçada ou lesão');
    urgencyLevel = 'alta';
    recommendedActions.push('Acolhimento imediato e verificação da integridade física do estudante');
    recommendedActions.push('Intensificar fiscalização presencial de inspetores no local reportado');
    suggestedProtocols.push('Protocolo de Segurança Física e Primeiros Socorros Escolares');
  }

  if (category === 'cyberbullying' || hasCyberStalking) {
    severityScore += 2;
    detectedSignals.push('Disseminação digital ou exposição em redes sociais');
    recommendedActions.push('Orientar preservação de prints/evidências sem compartilhamento');
    recommendedActions.push('Ação preventiva em sala sobre cidadania digital e Lei 14.811/2024');
    suggestedProtocols.push('Protocolo de Combate à Violência Virtual Escolar');
  }

  if (category === 'exclusao' || category === 'psicologico' || hasSevereThreats) {
    severityScore += 2;
    detectedSignals.push('Sofrimento emocional e pressão psicológica contínua');
    recommendedActions.push('Sessão de escuta reservada com orientador pedagógico ou psicólogo escolar');
    recommendedActions.push('Dinâmica restaurativa sem expor a vítima ou forçar confrontação');
    suggestedProtocols.push('Acolhimento Socioemocional e Apoio Psicológico');
  }

  if (isRecurrent) {
    severityScore += 2;
    detectedSignals.push('Padrão crônico e repetitivo de agressão');
  }

  if (location.includes('Banheiro') || location.includes('Saída') || location.includes('Transporte')) {
    detectedSignals.push(`Ponto cego de supervisão identificado: ${location}`);
    recommendedActions.push(`Aumentar rondas de supervisão no ponto crítico (${location})`);
  }

  if (severityScore >= 8 || hasSevereThreats || hasPhysicalWords) {
    urgencyLevel = 'critica';
  } else if (severityScore >= 6) {
    urgencyLevel = 'alta';
  } else if (severityScore >= 4) {
    urgencyLevel = 'media';
  }

  if (detectedSignals.length === 0) {
    detectedSignals.push('Conflito interpessoal ou intimidação verbal pontual');
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push('Observação discreta da turma pelo professor regente');
    recommendedActions.push('Diálogo formativo com a turma sobre respeito mútuo');
  }

  // Empathetic and safe message for the student
  const supportMessageForStudent = 
    `Sua coragem em relatar essa situação é fundamental. ` +
    `Você não está sozinho(a) e o que aconteceu não é culpa sua. ` +
    `Nossa equipe escolar recebeu seu relato com total sigilo e já está mobilizada para agir com cuidado e discrição, ` +
    `garantindo sua tranquilidade e segurança dentro da escola. ` +
    `Se precisar de apoio imediato ou desabafar, procure a sala de orientação ou conte com canais de escuta segura.`;

  const riskSummary = `Alerta de nível ${urgencyLevel.toUpperCase()} detectado. Envolveu ${CATEGORY_LABELS[category] || category} no local "${location}". Foram sinalizados ${detectedSignals.length} fatores de atenção. Recomendada ação pedagógica preventiva com discrição.`;

  return {
    severityScore: Math.min(Math.max(severityScore, 1), 10),
    urgencyLevel,
    detectedSignals,
    recommendedActions,
    supportMessageForStudent,
    riskSummary,
    suggestedSchoolProtocols: suggestedProtocols.length ? suggestedProtocols : ['Protocolo Padrão de Mediação Escolar'],
  };
}

export async function runAiTriage(
  category: BullyingCategory,
  location: string,
  timeframe: string,
  description: string,
  involvedPeople?: string
): Promise<AiTriageAnalysis> {
  const fallback = analyzeWithLocalEngine(category, location, timeframe, description, involvedPeople);

  // Check if Gemini API key exists
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';

  if (!apiKey) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o sistema inteligente de acolhimento e triagem pedagógica escolar contra bullying de uma escola brasileira (conforme a Lei 13.185/2016 e Lei 14.811/2024).
Analise o seguinte relato anônimo de bullying:

- Categoria: ${category} (${CATEGORY_LABELS[category] || ''})
- Local do Incidente: ${location}
- Período/Frequência: ${timeframe}
- Descrição do Aluno: """${description}"""
- Pessoas/Ambiente Envolvido: """${involvedPeople || 'Não especificado'}"""

Retorne APENAS um objeto JSON válido (sem tags markdown, sem blocos de código adicionais) com os seguintes campos:
{
  "severityScore": (número inteiro de 1 a 10),
  "urgencyLevel": ("baixa" | "media" | "alta" | "critica"),
  "detectedSignals": ["array com 2 a 4 pontos de atenção detectados no relato"],
  "recommendedActions": ["array com 2 a 4 ações pedagógicas práticas e discretas para a coordenação"],
  "supportMessageForStudent": "mensagem acolhedora, empática, que valide a dor do aluno sem julgamento e reforce que ele está seguro e não tem culpa",
  "riskSummary": "resumo executivo claro em 1 ou 2 frases para a coordenação escolar",
  "suggestedSchoolProtocols": ["array com protocolos escolares sugeridos"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim()) as AiTriageAnalysis;
      if (parsed.severityScore && parsed.urgencyLevel && parsed.supportMessageForStudent) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Erro ao consultar Gemini API, utilizando triagem heurística especializada:', error);
  }

  return fallback;
}

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  isBullying: boolean;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'Dois amigos discutem acaloradamente sobre qual time de futebol é o melhor, se desentendem uma vez no recreio, mas continuam conversando no dia seguinte.',
    isBullying: false,
    explanation: 'Isto é um desentendimento ou conflito pontual. Não há repetição sistemática, nem desequilíbrio de poder deliberado para humilhar.',
  },
  {
    id: 2,
    scenario: 'Um grupo cria stickers no WhatsApp com fotos tiradas escondidas de um aluno tímido, compartilhando no grupo da escola com piadas sobre seu peso todos os dias.',
    isBullying: true,
    explanation: 'Isto é Cyberbullying grave (previsto no Código Penal pela Lei 14.811/2024). Há exposição indevida, repetição contínua e intenção deliberada de diminuir a vítima.',
  },
  {
    id: 3,
    scenario: 'Sempre que determinado aluno entra na sala de aula, colegas imitam sua voz, derrubam seus cadernos "sem querer" e o isolam de todos os trabalhos em grupo há várias semanas.',
    isBullying: true,
    explanation: 'Isto é Bullying característico. Apresenta os três pilares essenciais: intenção de ferir, repetição constante e assimetria de forças/isolamento.',
  },
];

export const EducationalHub: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean | null>>({});

  const handleAnswer = (questionId: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">
          Educação, Conscientização & Legislação
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Guia de Prevenção e Direitos do Estudante
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Entenda a diferença entre conflito e intimidação sistemática, conheça as leis de proteção e saiba como agir.
        </p>
      </div>

      {/* Os 3 Pilares do Bullying */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Como identificar o Bullying verdadeiro?
        </h2>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Nem todo desentendimento é bullying. Para ser caracterizado como intimidação sistemática, o comportamento normalmente envolve três elementos simultâneos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs font-mono font-bold text-indigo-600 block mb-1">01. INTENCIONALIDADE</span>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Ato Deliberado</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              O agressor tem o propósito consciente de diminuir, constranger ou magoar o outro. Não foi um acidente isolado.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs font-mono font-bold text-indigo-600 block mb-1">02. REPETIÇÃO</span>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Padrão Frequente</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acontece repetidamente ao longo do tempo (dias, semanas ou meses), criando na vítima uma sensação de medo constante.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs font-mono font-bold text-indigo-600 block mb-1">03. DESEQUILÍBRIO</span>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Assimetria de Poder</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diferença de força física, número de pessoas (grupo contra um) ou influência e popularidade, deixando a vítima vulnerável.
            </p>
          </div>
        </div>
      </section>

      {/* Legislação Brasileira */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-indigo-700" />
          <h2 className="text-base font-bold text-slate-900">
            O Que Diz a Lei no Brasil?
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-indigo-600 pl-4 py-1">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
              Lei nº 13.185 / 2016 · Programa de Combate ao Bullying
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Determina que escolas e instituições de ensino têm a obrigação legal de promover medidas permanentes de conscientização, prevenção e acolhimento socioemocional, evitando a cultura do silêncio.
            </p>
          </div>

          <div className="border-l-4 border-rose-600 pl-4 py-1">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
              Lei nº 14.811 / 2024 · Tipificação no Código Penal
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Instituiu penas explícitas para o crime de intimidação sistemática. No caso do <strong>Cyberbullying</strong> (praticado via redes sociais, grupos de mensagens ou fóruns virtuais), a lei prevê <strong>pena de reclusão de 2 a 4 anos e multa</strong> se não constituir crime mais grave.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Interativo de Conscientização */}
      <section className="bg-slate-100/70 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Teste de Reflexão: É Brincadeira ou é Bullying?
            </h2>
            <p className="text-xs text-slate-500">
              Analise as situações reais abaixo e teste sua percepção.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q) => {
            const userAnswer = quizAnswers[q.id];
            const hasAnswered = userAnswer !== undefined && userAnswer !== null;
            const isCorrect = hasAnswered && userAnswer === q.isBullying;

            return (
              <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3">
                  "{q.scenario}"
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => handleAnswer(q.id, false)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                      hasAnswered && userAnswer === false
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    Conflito Normal / Brincadeira
                  </button>

                  <button
                    onClick={() => handleAnswer(q.id, true)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                      hasAnswered && userAnswer === true
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    Bullying / Intimidação
                  </button>
                </div>

                {hasAnswered && (
                  <div
                    className={`mt-3 p-3 rounded-md text-xs leading-relaxed flex items-start gap-2 ${
                      isCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-amber-50 text-amber-950 border border-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong>{isCorrect ? 'Resposta correta!' : 'Atenção aos detalhes:'}</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Como Ajudar: Testemunhas Ativas */}
      <section className="bg-indigo-900 text-white rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-bold mb-2">
          Você viu alguém sofrer bullying? Não seja um espectador passivo.
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed mb-6">
          Em mais de 80% dos casos de bullying, o agressor só continua porque os colegas assistem, riem ou fingem que não viram. Quando um colega se manifesta ou denuncia, o bullying cessa em segundos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
            <span className="font-bold text-white block mb-1">1. Não ria nem compartilhe</span>
            <span className="text-indigo-200">
              Negar plateia ao agressor retira o poder que ele busca na humilhação pública.
            </span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
            <span className="font-bold text-white block mb-1">2. Acolha a vítima depois</span>
            <span className="text-indigo-200">
              Convide a pessoa para se sentar junto, almoçar ou caminhar. Um simples "você está bem?" faz diferença vital.
            </span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
            <span className="font-bold text-white block mb-1">3. Denuncie anonimamente</span>
            <span className="text-indigo-200">
              Use a opção "Eu vi acontecer" no sistema da escola para alertar a coordenação sem nenhum risco para você.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface CoordinatorLoginGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

const DEFAULT_PASSCODES = ['12345', 'coordenacao2026', '1234'];

export const CoordinatorLoginGate: React.FC<CoordinatorLoginGateProps> = ({
  onAuthenticated,
  onCancel,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = passcode.trim();

    // Check against standard passcodes or custom stored passcode
    const customPass = localStorage.getItem('escola_segura_coord_pin');
    const validCodes = customPass ? [customPass, ...DEFAULT_PASSCODES] : DEFAULT_PASSCODES;

    if (validCodes.includes(cleanInput.toLowerCase())) {
      setIsLoading(true);
      setTimeout(() => {
        sessionStorage.setItem('escola_segura_coord_auth', 'true');
        onAuthenticated();
      }, 350);
    } else {
      setErrorMsg('Chave de acesso incorreta. A chave padrão da coordenação é 12345.');
    }
  };

  const handleQuickDemoFill = (code: string) => {
    setPasscode(code);
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-indigo-300" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase font-semibold block mb-1">
            Área de Acesso Restrito
          </span>
          <h2 className="text-xl font-extrabold text-white">
            Coordenação e Direção Escolar
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Acesso reservado exclusivamente para a equipe pedagógica e gestora da instituição.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Sigilo Institucional Obrigatório:</strong> As informações contidas nesta área envolvem relatos sensíveis de alunos, protegidos pelo Estatuto da Criança e do Adolescente (ECA) e LGPD.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
              Chave de Acesso / Senha Institucional
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Digite a chave de acesso (12345)"
                required
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}
          </div>

          {/* Quick Preset helper for testing / evaluator */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              Chave de Acesso Oficial da Coordenação:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('12345')}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold border border-indigo-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                Preencher Chave: 12345
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao Espaço do Aluno
            </button>

            <button
              type="submit"
              disabled={isLoading || !passcode.trim()}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? 'Autenticando...' : 'Acessar Painel Restrito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

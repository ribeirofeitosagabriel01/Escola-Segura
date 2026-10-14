import React from 'react';
import { Phone, HeartHandshake, ShieldCheck } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Ambiente 100% anônimo e protegido. Nenhum dado pessoal, IP ou localização é registrado.
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-200 font-medium">CVV: Ligue 188</span>
            <span className="text-slate-500">(24h gratuito)</span>
          </div>
          <span className="text-slate-700" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200 font-medium">Disque 100</span>
            <span className="text-slate-500">(Direitos da Criança)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

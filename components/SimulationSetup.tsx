
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onStart: (config: { questions: number, time: number }) => void;
  onBack: () => void;
  onUpgrade: () => void;
}

const SimulationSetup: React.FC<Props> = ({ profile, onStart, onBack, onUpgrade }) => {
  const [qCount, setQCount] = useState(10);
  const [time, setTime] = useState(30);

  const isRestricted = !profile.isPremium;

  return (
    <div className="max-w-xl mx-auto px-6 animate-fadeIn">
      <button onClick={onBack} className="text-slate-500 mb-8 hover:text-white transition-colors">← Voltar</button>
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif gradient-text mb-2">Modo Simulado</h2>
        <p className="text-slate-400 text-sm">Configure sua prova de fogo personalizada.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
        <div>
          <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-4">Número de Questões</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map(n => (
              <button
                key={n}
                disabled={isRestricted && n > 5}
                onClick={() => setQCount(n)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  qCount === n ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-600'
                } ${isRestricted && n > 5 ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-4">Tempo Limite (minutos)</label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 30, 60, 120].map(t => (
              <button
                key={t}
                disabled={isRestricted && t > 10}
                onClick={() => setTime(t)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  time === t ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-slate-800 bg-slate-950 text-slate-600'
                } ${isRestricted && t > 10 ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isRestricted && (
           <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
             <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Limite do Plano Gratuito</p>
             <p className="text-xs text-slate-400 leading-tight">Como usuário free, você pode testar simulados de até 5 questões. Assine para provas reais de até 100 questões.</p>
             <button onClick={onUpgrade} className="text-blue-400 font-bold text-xs mt-2 underline">Liberar tudo agora</button>
           </div>
        )}

        <button
          onClick={() => onStart({ questions: qCount, time: time })}
          className="w-full bg-white text-slate-950 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          INICIAR SIMULADO
        </button>
      </div>
    </div>
  );
};

export default SimulationSetup;

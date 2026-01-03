
import React from 'react';
import { UserProfile, Question } from '../types';

interface Props {
  profile: UserProfile;
  stats: {
    total: number;
    correct: number;
    wrong: number;
    time: string;
    avgTime: string;
    wrongQuestions?: Question[];
  };
  onClose: () => void;
  onUpgrade: () => void;
}

const SimulationResults: React.FC<Props> = ({ profile, stats, onClose, onUpgrade }) => {
  const scorePercent = Math.round((stats.correct / stats.total) * 100);
  const isSufficient = scorePercent >= 50;

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn pb-32">
      <div className="space-y-8">
        
        {/* Main Performance Card */}
        <div className="ai-card p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
          
          <div className="mb-8">
            {isSufficient ? (
              <div className="space-y-4">
                <div className="text-5xl animate-bounce">🏆</div>
                <h2 className="text-3xl font-header font-bold text-white">Desempenho de Elite!</h2>
                <p className="text-slate-500">Você atingiu a meta de prontidão acadêmica.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-5xl opacity-40 grayscale">📚</div>
                <h2 className="text-3xl font-header font-bold text-slate-300">Quase lá...</h2>
                <p className="text-slate-500">Ajuste seu raciocínio com os bizus abaixo.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Acertos</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.correct}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Erros</p>
              <p className="text-2xl font-bold text-rose-400">{stats.wrong}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Tempo Médio</p>
              <p className="text-xl font-bold text-blue-400">{stats.avgTime}s</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Precisão</p>
              <p className="text-xl font-bold text-white">{scorePercent}%</p>
            </div>
          </div>
        </div>

        {/* Dynamic Revision Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
               <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-1.003l-.548-.547z" /></svg>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Análise da Professora Kátia</h3>
          </div>

          <div className={`relative ${!profile.isPremium ? 'overflow-hidden rounded-3xl' : ''}`}>
             <div className={!profile.isPremium ? 'blur-xl select-none pointer-events-none' : 'space-y-4'}>
                {stats.wrongQuestions && stats.wrongQuestions.length > 0 ? (
                  stats.wrongQuestions.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="ai-card p-6 border-l-4 border-l-blue-500 bg-neutral-900/40 space-y-3">
                       <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider">Tópico de Revisão: {q.type === 'Clinical' ? 'Caso Clínico Complexo' : 'Conhecimento Teórico'}</h4>
                       <p className="text-slate-400 text-sm italic leading-relaxed">
                         "Nesta questão, o erro comum é focar no sintoma isolado. A análise da banca exige visão holística..."
                       </p>
                       <div className="pt-2">
                          <p className="text-white text-xs font-medium bg-white/5 px-3 py-2 rounded-lg inline-block">
                             Bizu Rápido: {q.explanation.split('.')[0]}.
                          </p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="ai-card p-10 text-center text-slate-500 italic">
                    Nenhum erro detectado. Mantenha a excelência!
                  </div>
                )}
             </div>

             {/* Premium Paywall */}
             {!profile.isPremium && (
               <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                 <div className="bg-neutral-900 border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl max-w-sm ai-glow-border">
                   <div className="w-16 h-16 bg-blue-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                     <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Ihhh, você não é aluno...</h3>
                   <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                     Assine agora para liberar a análise completa dos seus erros, bizus da Professora Kátia e resumos focados no seu desempenho.
                   </p>
                   <button
                     onClick={onUpgrade}
                     className="w-full ai-btn-primary py-4 text-sm font-bold shadow-xl shadow-white/5"
                   >
                     LIBERAR ANÁLISE ELITE
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl border border-white/5 text-slate-500 font-bold text-xs uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all"
          >
            VOLTAR AO PAINEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;

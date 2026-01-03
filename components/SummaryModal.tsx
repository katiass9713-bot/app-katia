
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  subject: string;
  content: string;
  onClose: () => void;
  onUpgrade: () => void;
}

const SummaryModal: React.FC<Props> = ({ profile, subject, content, onClose, onUpgrade }) => {
  const currentDay = new Date().getDate();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slideUp relative">
        
        {/* Header Section */}
        <div className="bg-petrol p-8 border-b border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                  Edição 2025
                </span>
              </div>
           </div>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
             Plantão de Elite • Episódio {currentDay}
           </p>
           <h2 className="text-3xl font-header font-bold text-white tracking-tight">{subject}</h2>
        </div>

        {/* Content Area */}
        <div className="p-10 max-h-[60vh] overflow-y-auto relative scrollbar-hide">
          <div className={`prose prose-invert prose-slate max-w-none ${!profile.isPremium ? 'mask-blur' : ''}`}>
             <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-base font-medium">
                {profile.isPremium ? content : content.slice(0, 400) + '...'}
             </div>
          </div>

          {/* Paywall Overlay */}
          {!profile.isPremium && (
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center justify-end p-10">
              <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full">
                 <p className="text-white text-sm font-bold mb-5 leading-relaxed">Amanhã este tema terá um novo enfoque estratégico!</p>
                 <button
                   onClick={onUpgrade}
                   className="w-full ai-btn-primary py-4 rounded-xl font-bold text-sm shadow-xl shadow-white/5"
                 >
                   ASSINAR ACESSO COMPLETO
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 flex justify-end bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            FECHAR RESUMO
          </button>
        </div>

        <style>{`
          .mask-blur {
            mask-image: linear-gradient(to bottom, black 10%, transparent 60%);
          }
        `}</style>
      </div>
    </div>
  );
};

export default SummaryModal;

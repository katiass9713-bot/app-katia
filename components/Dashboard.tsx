
import React from 'react';
import { UserProfile, ExamBoard, Difficulty } from '../types';

interface Props {
  profile: UserProfile;
  onTrain: () => void;
  onSimulate: () => void;
  onSummary: (subject: string) => void;
  onUpgrade: () => void;
  onSettingsChange: (key: string, value: any) => void;
  examBoard: ExamBoard;
  difficulty: Difficulty;
}

const Dashboard: React.FC<Props> = ({ 
  profile, onTrain, onSimulate, onSummary, onUpgrade, onSettingsChange, examBoard, difficulty 
}) => {
  const subjects = [
    { id: 'farmaco', name: 'Farmaco', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.022.547l-2.387 2.387a2 2 0 102.828 2.828l3.182-3.182h1.571l3.182 3.182a2 2 0 102.828-2.828l-2.387-2.387z" /></svg>
    ) },
    { id: 'emergencia', name: 'Urgência', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    ) },
    { id: 'saudepublica', name: 'S. Coletiva', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) },
    { id: 'materno', name: 'Materno', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    ) },
    { id: 'semio', name: 'Semio', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ) },
    { id: 'cirurgica', name: 'Cirúrgica', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" /></svg>
    ) },
    { id: 'adm', name: 'Gestão', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ) },
    { id: 'pato', name: 'Fisiopato', icon: (
      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
    ) },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-header font-bold text-white">Olá, {profile.name || 'Enfermeira'}</h1>
          <p className="text-slate-500 mt-1">Sua jornada rumo à aprovação.</p>
        </div>
        <div className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center text-white font-bold">
          {profile.name?.charAt(0) || 'E'}
        </div>
      </div>

      {/* Main Tools Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={onTrain} className="ai-card p-8 text-left group">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sessão de Estudo</h3>
          <p className="text-slate-500 text-sm leading-relaxed">Questões inteligentes baseadas em casos clínicos reais.</p>
        </button>

        <button onClick={onSimulate} className="ai-card p-8 text-left group">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Modo Simulado</h3>
          <p className="text-slate-500 text-sm leading-relaxed">Teste seu conhecimento com tempo e pressão real de exame.</p>
        </button>
      </div>

      {/* Customization Bar */}
      <div className="ai-card p-8 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Banca Examinadora</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(ExamBoard).map(b => (
              <button 
                key={b} 
                onClick={() => onSettingsChange('examBoard', b)}
                className={`px-5 py-3 rounded-full text-xs font-semibold border transition-all ${examBoard === b ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Complexidade</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Difficulty).map(d => (
              <button 
                key={d} 
                onClick={() => onSettingsChange('difficulty', d)}
                className={`px-5 py-3 rounded-full text-xs font-semibold border transition-all ${difficulty === d ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Hub */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resumos Estratégicos</h3>
        <div className="grid grid-cols-4 gap-3">
          {subjects.map(s => (
            <button key={s.id} onClick={() => onSummary(s.name)} className="ai-card p-4 flex flex-col items-center gap-3 group">
              <div className="opacity-60 group-hover:opacity-100 transition-opacity">{s.icon}</div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Premium Banner (Clean) */}
      {!profile.isPremium && (
        <div className="p-8 ai-card ai-glow-border bg-gradient-to-br from-blue-900/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Domine todas as bancas</h3>
            <p className="text-sm text-slate-500 mt-1">Questões ilimitadas, resumos diários e simulados avançados.</p>
          </div>
          <button onClick={onUpgrade} className="ai-btn-primary px-8 py-4 text-sm whitespace-nowrap">
            Conhecer Plano Elite
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  UserProfile, StudyObjective, Difficulty, ExamBoard, 
  ResidencyArea 
} from './types';
import Dashboard from './components/Dashboard';
import QuestionEngine from './components/QuestionEngine';
import SimulationSetup from './components/SimulationSetup';
import SimulationEngine from './components/SimulationEngine';
import SimulationResults from './components/SimulationResults';
import SummaryModal from './components/SummaryModal';
import PremiumPage from './components/PremiumPage';
import ProfessorKatia from './components/ProfessorKatia';
import PaymentModal from './components/PaymentModal';
import { generateSummary } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'objective' | 'residency_area' | 'objective_level' | 'diagnose' | 'loading' | 'dashboard' | 'training' | 'simulation_setup' | 'simulation_engine' | 'simulation_results' | 'premium'>('login');
  const [isSecurityLocked, setIsSecurityLocked] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('enfq_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      objective: null,
      residencyArea: null,
      experienceLevel: '',
      studyTime: '',
      dailyCommitment: '',
      mainPainPoint: '',
      isPremium: false,
      subscriptionExpiry: null,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      maxStreak: 0,
      deviceIds: [],
      isLocked: false
    };
  });

  const [examBoard, setExamBoard] = useState<ExamBoard>(ExamBoard.ENARE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [currentSummary, setCurrentSummary] = useState<{ subject: string, content: string } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [simulationConfig, setSimulationConfig] = useState<{ questions: number, time: number } | null>(null);
  const [simulationStats, setSimulationStats] = useState<any>(null);

  // Sistema de Segurança Anti-Fraude (Máximo 2 Dispositivos)
  useEffect(() => {
    const fingerprint = navigator.userAgent + screen.width + screen.height;
    
    if (profile.isPremium) {
      // Se já estiver bloqueado manualmente no storage
      if (profile.isLocked) {
        setIsSecurityLocked(true);
        setView('login');
        return;
      }

      // Se o dispositivo atual não está na lista de autorizados
      if (profile.deviceIds.length > 0 && !profile.deviceIds.includes(fingerprint)) {
        // Se já atingiu o limite de 2 dispositivos, bloqueia o acesso
        if (profile.deviceIds.length >= 2) {
          setIsSecurityLocked(true);
          setProfile(p => ({ ...p, isLocked: true }));
          setView('login');
        } else {
          // Adiciona o segundo dispositivo automaticamente se for premium
          setProfile(p => ({ ...p, deviceIds: [...p.deviceIds, fingerprint] }));
        }
      }
    }
  }, [profile.isPremium, profile.deviceIds, profile.isLocked]);

  useEffect(() => {
    localStorage.setItem('enfq_profile', JSON.stringify(profile));
  }, [profile]);

  const handleAccessPlatform = () => {
    if (isSecurityLocked) return;
    setView('objective');
  };

  const contactSupport = () => {
    window.open("https://wa.me/5591984243443?text=Olá, meu acesso ao enfQ foi bloqueado por excesso de dispositivos. Gostaria de regularizar minha situação.", "_blank");
  };

  const handleFinishDiagnose = () => {
    setView('loading');
    setTimeout(() => setView('dashboard'), 1500);
  };

  const handleSummaryRequest = async (subject: string) => {
    setSummaryLoading(true);
    try {
      const content = await generateSummary(subject);
      setCurrentSummary({ subject, content });
    } catch (e) {
      console.error(e);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-2xl mx-auto px-6 pt-12 pb-32">
        
        {view === 'login' && (
          <div className="flex flex-col items-center text-center space-y-16 animate-fadeIn pt-20">
            <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all duration-700 ${isSecurityLocked ? 'bg-rose-900/50 shadow-rose-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
               <svg className={`w-10 h-10 ${isSecurityLocked ? 'text-rose-400' : 'text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 {isSecurityLocked ? (
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" d="M18 7L17 8L16 7M13 11L12 12L11 11M21 3L19 5M14 6L18 10M5 15L3 21L9 19L19 9L15 5L5 15ZM9 13L11 15" />
                 )}
               </svg>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl font-header font-extrabold ai-text-gradient tracking-tight">enfQ®</h1>
              <div className="space-y-2">
                <p className="text-white font-medium text-lg">Treine com inteligência para a sua vaga.</p>
                {isSecurityLocked ? (
                  <div className="space-y-4">
                    <p className="text-rose-500 text-sm font-bold uppercase tracking-widest animate-pulse">LIMITE DE DISPOSITIVOS EXCEDIDO</p>
                    <p className="text-slate-400 text-xs px-10">Detectamos acesso simultâneo em múltiplos aparelhos. O compartilhamento de acesso viola nossos termos e causa bloqueio imediato.</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">A plataforma de elite para quem busca a aprovação em Enfermagem.</p>
                )}
              </div>
            </div>
            
            <div className="w-full max-w-xs space-y-8">
              {isSecurityLocked ? (
                <button 
                  onClick={contactSupport}
                  className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Falar com Suporte
                </button>
              ) : (
                <button 
                  onClick={handleAccessPlatform} 
                  className="w-full ai-btn-primary py-4 text-sm relative overflow-hidden group transition-all duration-500"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                  Acessar Plataforma
                </button>
              )}
              
              <ProfessorKatia message={isSecurityLocked ? "Poxa, detectamos que sua conta foi compartilhada além do limite de 2 aparelhos autorizados. Para sua segurança e proteção do conteúdo, o acesso foi congelado." : "Oi! Sou a Profª Kátia. Estou aqui para guiar seu raciocínio clínico rumo à aprovação."} />
            </div>
          </div>
        )}

        {view === 'objective' && (
          <div className="animate-fadeIn space-y-10">
            <div className="text-center">
               <h2 className="text-3xl font-header font-bold ai-text-gradient">Qual seu foco acadêmico?</h2>
               <p className="text-slate-500 mt-2">Personalizaremos o conteúdo com base na sua escolha.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: StudyObjective.CONTEST, label: 'Concursos Públicos', icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) },
                { id: StudyObjective.RESIDENCY, label: 'Residência em Enfermagem', icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                ) },
                { id: StudyObjective.GRADUATION, label: 'Graduação Acadêmica', icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14v7" /></svg>
                ) },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setProfile(p => ({ ...p, objective: opt.id }));
                    if (opt.id === StudyObjective.RESIDENCY) setView('residency_area');
                    else setView('objective_level');
                  }}
                  className="ai-card p-6 flex items-center gap-6 text-left group"
                >
                  <div className="opacity-60 group-hover:opacity-100 transition-opacity">{opt.icon}</div>
                  <span className="text-lg font-semibold text-white">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'residency_area' && (
          <div className="animate-fadeIn space-y-10">
            <div className="text-center">
               <h2 className="text-3xl font-header font-bold ai-text-gradient">Especialidade Alvo</h2>
               <p className="text-slate-500 mt-2">Selecione a área para questões direcionadas.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(ResidencyArea).map(area => (
                <button
                  key={area}
                  onClick={() => {
                    setProfile(p => ({...p, residencyArea: area}));
                    setView('objective_level');
                  }}
                  className="w-full ai-card p-5 text-left text-slate-300 font-medium hover:border-blue-500/50"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'objective_level' && (
           <div className="animate-fadeIn space-y-10">
             <div className="text-center">
               <h2 className="text-3xl font-header font-bold ai-text-gradient">Sua experiência atual</h2>
             </div>
             <div className="space-y-3">
               {[
                 { label: 'Já estudo para provas', val: 'Já estudo' },
                 { label: 'Vou começar a preparação agora', val: 'Vou começar' },
                 { label: 'Preciso de orientação inicial', val: 'Falta motivação' }
               ].map(opt => (
                 <button
                   key={opt.val}
                   onClick={() => {
                     setProfile(p => ({...p, experienceLevel: opt.val}));
                     setView('diagnose');
                   }}
                   className="w-full ai-card p-6 text-left font-medium text-white hover:border-blue-500/50"
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
           </div>
        )}

        {view === 'diagnose' && (
          <div className="animate-fadeIn space-y-12">
            <div className="text-center">
               <h2 className="text-3xl font-header font-bold ai-text-gradient">Configurar Perfil</h2>
            </div>
            <div className="space-y-8">
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Nome de Usuário</label>
                 <input 
                   type="text" 
                   placeholder="Seu nome"
                   className="w-full bg-neutral-900/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all"
                   onChange={(e) => setProfile(p => ({...p, name: e.target.value}))}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Carga de Estudo Diária</label>
                 <select 
                   className="w-full bg-neutral-900/40 border border-white/5 p-5 rounded-2xl text-slate-400 outline-none appearance-none"
                   onChange={(e) => setProfile(p => ({...p, dailyCommitment: e.target.value}))}
                 >
                   <option value="">Selecione...</option>
                   <option value="1h">1 hora por dia</option>
                   <option value="2h">2 a 4 horas por dia</option>
                   <option value="4h">Foco total (4h+)</option>
                 </select>
               </div>
               <button 
                 onClick={handleFinishDiagnose}
                 className="w-full ai-btn-primary py-5 text-base"
               >
                 Acessar Painel Inteligente
               </button>
            </div>
          </div>
        )}

        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center pt-52 animate-fadeIn text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8">
               <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium mb-2">Processando Parâmetros Acadêmicos...</p>
            <p className="text-slate-500 text-xs uppercase tracking-widest">90% dos alunos melhoram o desempenho com a enfQ®</p>
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            onTrain={() => setView('training')}
            onSimulate={() => setView('simulation_setup')}
            onSummary={handleSummaryRequest}
            onUpgrade={() => setView('premium')}
            onSettingsChange={(k, v) => k === 'examBoard' ? setExamBoard(v) : setDifficulty(v)}
            examBoard={examBoard}
            difficulty={difficulty}
          />
        )}

        {view === 'training' && (
          <QuestionEngine 
            profile={profile}
            difficulty={difficulty}
            board={examBoard}
            onBack={() => setView('dashboard')}
            onQuestionComplete={(correct) => {
              setProfile(p => ({
                ...p,
                questionsAnswered: p.questionsAnswered + 1,
                correctAnswers: correct ? p.correctAnswers + 1 : p.correctAnswers,
                streak: correct ? p.streak + 1 : 0,
                maxStreak: correct ? Math.max(p.streak + 1, p.maxStreak) : p.maxStreak
              }));
            }}
          />
        )}

        {view === 'simulation_setup' && (
          <SimulationSetup 
            profile={profile}
            onStart={(config) => {
              setSimulationConfig(config);
              setView('simulation_engine');
            }}
            onBack={() => setView('dashboard')}
            onUpgrade={() => setView('premium')}
          />
        )}

        {view === 'simulation_engine' && simulationConfig && (
          <SimulationEngine 
            profile={profile}
            config={simulationConfig}
            board={examBoard}
            onComplete={(stats) => {
              setSimulationStats(stats);
              setProfile(p => ({
                ...p,
                questionsAnswered: p.questionsAnswered + stats.total,
                correctAnswers: p.correctAnswers + stats.correct
              }));
              setView('simulation_results');
            }}
          />
        )}

        {view === 'simulation_results' && simulationStats && (
          <SimulationResults 
            profile={profile}
            stats={simulationStats}
            onClose={() => setView('dashboard')}
            onUpgrade={() => setView('premium')}
          />
        )}

        {view === 'premium' && (
          <PremiumPage 
            onBack={() => setView('dashboard')} 
            onSubscribe={() => setShowPaymentModal(true)} 
          />
        )}
      </main>

      {summaryLoading && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-white/5 rounded-3xl mb-8 flex items-center justify-center ai-loader border border-white/10">
             <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-header font-bold text-white mb-2">Buscando resumo adequado...</h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] animate-pulse">Inteligência Acadêmica Ativa</p>
        </div>
      )}

      {(view === 'dashboard' || view === 'training' || view === 'simulation_setup') && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 nav-minimal px-8 py-5">
          <div className="max-w-md mx-auto flex justify-between items-center">
            {[
              { id: 'dashboard', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              ), label: 'Início' },
              { id: 'training', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              ), label: 'Estudo' },
              { id: 'simulation_setup', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              ), label: 'Simulado' },
              { id: 'premium', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
              ), label: 'Elite' }
            ].map(item => (
              <button key={item.id} onClick={() => setView(item.id as any)} className="flex flex-col items-center gap-1.5 flex-1 group">
                 <span className={`transition-all duration-300 ${view === item.id ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.icon}</span>
                 <span className={`text-[10px] font-semibold ${view === item.id ? 'text-white' : 'text-slate-600'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {currentSummary && (
        <SummaryModal 
          profile={profile}
          subject={currentSummary.subject}
          content={currentSummary.content}
          onClose={() => setCurrentSummary(null)}
          onUpgrade={() => {
            setCurrentSummary(null);
            setView('premium');
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            const fingerprint = navigator.userAgent + screen.width + screen.height;
            setProfile(prev => ({ 
              ...prev, 
              isPremium: true,
              deviceIds: [fingerprint], // Registra o primeiro dispositivo
              subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }));
            setShowPaymentModal(false);
            setView('dashboard');
          }}
        />
      )}
    </div>
  );
};

export default App;

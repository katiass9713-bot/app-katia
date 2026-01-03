
import React, { useState, useEffect } from 'react';
import { Question, UserProfile, ExamBoard } from '../types';
import { generateQuestion } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  config: { questions: number, time: number };
  board: ExamBoard;
  onComplete: (stats: any) => void;
}

const SimulationEngine: React.FC<Props> = ({ profile, config, board, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(config.time * 60);
  const [genProgress, setGenProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "Sua aprovação é construída questão por questão.",
    "O simulado é o campo de treino para o seu sucesso.",
    "Respire fundo. Concentração é a chave.",
    "Lembre-se: ler o enunciado com atenção evita 70% dos erros.",
    "Você está calibrando seu raciocínio de elite.",
    "Buscando questões de alto nível..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const fetchBatch = async () => {
      const qList: Question[] = [];
      let lastType: 'Theoretical' | 'Clinical' | undefined;
      
      for(let i=0; i<config.questions; i++) {
        setGenProgress(i + 1);
        const q = await generateQuestion(
          profile.objective || 'Geral', 
          'Médio' as any, 
          board, 
          profile.residencyArea,
          lastType
        );
        qList.push(q);
        lastType = q.type;
      }
      setQuestions(qList);
      setLoading(false);
    };
    fetchBatch();
  }, [config.questions, board, profile.objective, profile.residencyArea]);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const handleFinish = () => {
    let correct = 0;
    const wrongQuestions: Question[] = [];
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      } else {
        wrongQuestions.push(q);
      }
    });

    const totalTimeSpent = (config.time * 60) - timeLeft;
    onComplete({
      total: config.questions,
      correct,
      wrong: config.questions - correct,
      time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`,
      avgTime: (totalTimeSpent / (answers.length || 1)).toFixed(1),
      unanswered: config.questions - answers.length,
      wrongQuestions // Passando as questões erradas para análise
    });
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-6 text-center pt-52 animate-fadeIn">
        <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center ai-loader border border-white/10">
           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-header font-bold text-white mb-6 tracking-tight">Preparando seu simulado...</h2>
        
        <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden mb-8 relative shadow-inner">
           <div 
            className="h-full bg-blue-500 transition-all duration-500 relative group" 
            style={{width: `${(genProgress/config.questions)*100}%`}}
           >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
           </div>
        </div>

        <p className="text-slate-400 text-sm italic animate-pulse">"{phrases[phraseIndex]}"</p>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/80 backdrop-blur-xl py-6 z-20 border-b border-white/5">
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl">💣</div>
           <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Tempo Restante</span>
              <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</span>
           </div>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{currentIndex + 1} de {questions.length}</span>
            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${((currentIndex+1)/questions.length)*100}%`}} />
            </div>
         </div>
      </div>

      <div className="ai-card p-8 md:p-10 space-y-12">
        <div className="space-y-4">
          <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">
            {currentQ.type === 'Clinical' ? 'Caso Clínico' : 'Questão Teórica'}
          </span>
          <p className="text-white text-lg leading-relaxed font-medium">{currentQ.case}</p>
        </div>
        
        <div className="space-y-3">
          {currentQ.alternatives.map((alt, i) => (
            <button
              key={i}
              onClick={() => {
                const newAns = [...answers];
                newAns[currentIndex] = i;
                setAnswers(newAns);
              }}
              className={`w-full p-6 rounded-2xl border text-left text-sm transition-all flex items-start gap-4 ${
                answers[currentIndex] === i ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/5' : 'border-white/5 bg-transparent text-slate-500'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${answers[currentIndex] === i ? 'bg-blue-500 text-white' : 'bg-white/5'}`}>{String.fromCharCode(65 + i)}</span>
              <span className="pt-0.5">{alt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="py-4 rounded-2xl ai-card text-slate-400 font-bold text-sm disabled:opacity-20 transition-colors hover:text-white"
        >
          ANTERIOR
        </button>
        <button
          onClick={() => {
            if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
            else handleFinish();
          }}
          className={`py-4 rounded-2xl font-bold text-sm transition-all shadow-xl ${
            currentIndex === questions.length - 1 
            ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
            : 'ai-card text-slate-400 hover:text-white'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'FINALIZAR AGORA' : 'PRÓXIMA'}
        </button>
      </div>
    </div>
  );
};

export default SimulationEngine;

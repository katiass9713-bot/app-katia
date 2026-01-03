
import React, { useState, useEffect } from 'react';
import { Question, UserProfile, Difficulty, ExamBoard } from '../types';
import { generateQuestion } from '../services/geminiService';
import ProfessorKatia from './ProfessorKatia';

interface Props {
  profile: UserProfile;
  difficulty: Difficulty;
  board: ExamBoard;
  onBack: () => void;
  onQuestionComplete: (correct: boolean) => void;
}

const QuestionEngine: React.FC<Props> = ({ profile, difficulty, board, onBack, onQuestionComplete }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "A persistência é o caminho do êxito.",
    "Um plantão por vez, uma questão por vez.",
    "90% dos alunos melhoram o desempenho com a enfQ®.",
    "Dica: Copie as respostas certas manualmente para fixar.",
    "Seu futuro como enfermeiro(a) começa agora.",
    "Calma. Vamos pensar juntas."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const loadNext = async () => {
    setLoading(true);
    setSelected(null);
    setShowResult(false);
    try {
      const q = await generateQuestion(
        profile.objective || 'Geral',
        difficulty,
        board,
        profile.residencyArea,
        question?.type
      );
      setQuestion(q);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadNext(); }, []);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const isCorrect = idx === question?.correctIndex;
    onQuestionComplete(isCorrect);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-52 animate-fadeIn text-center">
        <div className="w-12 h-12 bg-white/5 ai-loader rounded-full border border-white/10 flex items-center justify-center">
           <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 text-white font-medium text-sm">Gerando questões...</p>
        <p className="mt-4 text-slate-500 text-xs italic max-w-xs animate-pulse">"{phrases[phraseIndex]}"</p>
      </div>
    );
  }

  const isCorrect = selected === question?.correctIndex;

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-500 text-xs font-semibold hover:text-white transition-colors">← Voltar ao painel</button>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-bold rounded-lg uppercase">{board}</span>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg uppercase">{difficulty}</span>
        </div>
      </div>

      <div className="ai-card p-8 md:p-12 space-y-12">
        <div className="prose prose-invert max-w-none">
          <p className="text-white text-xl leading-relaxed font-medium">
            {question?.case}
          </p>
        </div>
        
        <div className="space-y-3">
          {question?.alternatives.map((alt, i) => {
            let style = "bg-transparent border-white/5 text-slate-400 hover:border-white/20";
            if (showResult) {
              if (i === question.correctIndex) style = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold";
              else if (i === selected) style = "bg-rose-500/10 border-rose-500/40 text-rose-400";
              else style = "opacity-30 grayscale";
            } else if (selected === i) {
                style = "bg-white/5 border-white/40 text-white font-bold";
            }

            return (
              <button 
                key={i} 
                disabled={showResult}
                onClick={() => handleSelect(i)} 
                className={`w-full p-6 rounded-2xl border text-left text-sm transition-all flex items-start gap-4 ${style}`}
              >
                <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
                <span className="pt-0.5">{alt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="animate-slideUp space-y-10">
          <div className="ai-card p-8 bg-neutral-900/50 space-y-6">
             <div className="flex items-center gap-4">
                <span className="text-2xl">{isCorrect ? '✨' : '⚠️'}</span>
                <h3 className={`font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? 'Resposta Correta' : 'Análise da Professora Kátia:'}
                </h3>
             </div>
             <p className="text-slate-400 leading-relaxed text-sm italic pl-4 border-l border-white/10">
                {question?.explanation}
             </p>
          </div>
          
          <ProfessorKatia message={question?.katiaTip || ""} />

          <button onClick={loadNext} className="w-full ai-btn-primary py-5 text-base">
             Próxima Questão
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionEngine;


import React from 'react';

interface Props {
  message: string;
}

const ProfessorKatia: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex flex-col items-center gap-2 animate-fadeIn max-w-sm mx-auto">
      <div className="text-center">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2 block">
          Mentoria de Elite
        </span>
        <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
          "{message}"
        </p>
      </div>
      <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-4"></div>
    </div>
  );
};

export default ProfessorKatia;

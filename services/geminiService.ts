
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, ExamBoard, ResidencyArea, StudyObjective } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Usando o modelo mais rápido disponível
const MODEL_NAME = 'gemini-3-flash-preview';

export const generateQuestion = async (
  objective: string, 
  difficulty: Difficulty, 
  board: ExamBoard,
  area: ResidencyArea | null,
  lastType?: 'Theoretical' | 'Clinical'
): Promise<Question> => {
  // Alternância entre teórica (direta) e clínica (caso)
  const isTheoretical = lastType === 'Clinical' || Math.random() > 0.5;
  const targetType = isTheoretical ? 'Conceito Teórico Direto' : 'Caso Clínico Realista';
  const isCebraspe = board === ExamBoard.CEBRASPE;

  const prompt = `Questão de Enfermagem ${difficulty} (${board}). 
    Foco: ${area || objective}. Tipo: ${targetType}.
    ${isCebraspe ? 'CERTO ou ERRADO.' : '5 alternativas.'}
    Responda em JSON estrito. Seja conciso no comentário.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          case: { type: Type.STRING },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          katiaTip: { type: Type.STRING }
        },
        required: ["case", "alternatives", "correctIndex", "explanation", "katiaTip"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    difficulty,
    isTrueFalse: isCebraspe,
    type: isTheoretical ? 'Theoretical' : 'Clinical'
  };
};

export const generateSummary = async (subject: string): Promise<string> => {
  const prompt = `Resumo executivo (Bizu) para Enfermagem: ${subject}. 
    Foco em diretrizes 2024/2025. Sem introduções longas. 
    Linguagem de mentoria da Profª Kátia. Sem asteriscos. 
    Dê um spoiler do próximo tema.
    Título negrito, "por professora Kátia" abaixo.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt
  });

  return response.text.replace(/\*\*/g, '');
};
